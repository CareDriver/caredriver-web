"use client";

import TriangleExclamation from "@/icons/TriangleExclamation";
import { FormEvent, useContext, useEffect, useState } from "react";
import { UserInterface } from "@/interfaces/UserInterface";
import { toast } from "react-toastify";
import { saveActionOnUser } from "@/components/app_modules/users/api/ActionOnUserRegister";
import { ActionOnUserPerformed } from "@/interfaces/ActionOnUserInterface";
import { Timestamp } from "firebase/firestore";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import Popup from "@/components/modules/Popup";
import BaseForm from "@/components/form/view/forms/BaseForm";
import {
    DateField as DateFieldForm,
    TextField as TextFieldForm,
} from "@/components/form/models/FormFields";
import {
    DEFAUL_DATE_FIELD,
    DEFAUL_TEXT_FIELD,
} from "@/components/form/models/DefaultFields";
import { PageStateContext } from "@/context/PageStateContext";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import TextField from "@/components/form/view/fields/TextField";
import { validateEmialWithComparison } from "../../../validators/for_confirmations/DataConfirmationValidator";
import { genDocId } from "@/utils/generators/IdGenerator";
import {
    isValidDateField,
    isValidTextField,
} from "@/components/form/validators/FieldValidators";
import { isValidChangeReason } from "@/validators/JustificationValidator";
import Clock from "@/icons/Clock";
import DateField from "@/components/form/view/fields/DateField";
import { validateDisableDate } from "../../../validators/for_data/DisableDateValidator";
import {
    differenceOnDays,
    getYesterdayInTimestamp,
} from "@/utils/helpers/DateHelper";

interface Form {
    deadline: DateFieldForm;
    confirmation: TextFieldForm;
    reason: TextFieldForm;
}

const DEFAULT_FORM: Form = {
    deadline: DEFAUL_DATE_FIELD,
    reason: DEFAUL_TEXT_FIELD,
    confirmation: DEFAUL_TEXT_FIELD,
};

interface Props {
    user: UserInterface;
    adminUser: UserInterface;
}

const FormToDisableUserByDateByAdmin: React.FC<Props> = ({
    user,
    adminUser,
}) => {
    const isDisable =
        user.disabledUntil !== undefined &&
        differenceOnDays(user.disabledUntil.toDate()) > 0;
    const [isOpenPopup, setOpenPopup] = useState(false);
    const { loading, setLoadingAll } = useContext(PageStateContext);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [form, setForm] = useState<Form>(DEFAULT_FORM);

    const ENABLE_LABEL = "Quitar deshabilitación por fecha";
    const DISABLE_LABEL = "Deshabilitar usuario por fecha";

    const toggleDisableUser = async () => {
        if (user.id) {
            if (isDisable) {
                try {
                    await toast.promise(
                        updateUser(user.id, {
                            disabledUntil: getYesterdayInTimestamp(),
                        }),
                        {
                            pending: "Removiendo desabilitacion",
                            success: "Desabilitacion removida",
                            error: "Error al remover la desabilitacion, inténtalo de nuevo",
                        },
                    );
                } catch (e) {
                    console.log(e);
                }
            } else if (form.deadline.value) {
                try {
                    await toast.promise(
                        updateUser(user.id, {
                            disabledUntil: Timestamp.fromDate(
                                form.deadline.value,
                            ),
                        }),
                        {
                            pending: "Deshabilitando al usuario por fecha",
                            success: "Usuario deshabilitado por fecha",
                            error: "Error al deshabilitar al usuario por fecha, inténtalo de nuevo",
                        },
                    );
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!loading || !formState.loading) {
            setLoadingAll(true, setFormState);

            if (user.id && adminUser.id) {
                const DOC_ID = genDocId();

                await toast.promise(
                    saveActionOnUser(DOC_ID, {
                        id: DOC_ID,
                        action: isDisable
                            ? ActionOnUserPerformed.Enable
                            : ActionOnUserPerformed.Disabled,
                        datetime: Timestamp.now(),
                        performedById: adminUser.id,
                        userId: user.id,
                        traceId: genDocId(),
                        reason: form.reason.value,
                    }),
                    {
                        pending: "Registrando acción",
                        success: "Acción registrada",
                        error: "Error al registrar la accion",
                    },
                );

                await toggleDisableUser();
                window.location.reload();
            } else {
                toast.error("No se puede encontrar al usuario");
                setLoadingAll(false, setFormState);
            }
        }
    };

    useEffect(() => {
        if (isOpenPopup) {
            setFormState((prev) => ({
                ...prev,
                isValid:
                    isValidTextField(form.confirmation) &&
                    (isDisable || isValidDateField(form.deadline)) &&
                    isValidTextField(form.reason),
            }));
        } else {
            setFormState((prev) => ({
                ...prev,
                isValid:
                    (isDisable || isValidDateField(form.deadline)) &&
                    isValidTextField(form.confirmation),
            }));
        }
    }, [form]);

    return (
        <div className={`form-sub-container | margin-top-50 max-width-40`}>
            <h2
                className={`text medium-big bolder | icon-wrapper ${
                    isDisable ? "green-icon green" : "yellow-icon yellow"
                }`}
            >
                <Clock />
                {isDisable ? ENABLE_LABEL : DISABLE_LABEL}
            </h2>
            <p>
                El usuario no podra usar la aplicacion mientras este
                desabilitando hasta una fecha establecida.
            </p>

            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: isDisable ? ENABLE_LABEL : DISABLE_LABEL,
                            buttonClassStyle: `small-general-button ${
                                isDisable ? "green" : "yellow"
                            } | text bolder`,
                        },
                        behavior: {
                            loading: formState.loading,
                            isValid: formState.isValid,
                        },
                    },
                }}
                behavior={{
                    loading: formState.loading || loading,
                    onSummit: async (e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        setOpenPopup(true);
                    },
                }}
            >
                <TextField
                    field={{
                        values: form.confirmation,
                        setter: (d) =>
                            setForm((prev) => ({ ...prev, confirmation: d })),
                        validator: (d) =>
                            validateEmialWithComparison(d, user.email),
                    }}
                    legend={"Correo del usuario"}
                />
                {!isDisable && (
                    <DateField
                        field={{
                            values: form.deadline,
                            setter: (d) =>
                                setForm((prev) => ({ ...prev, deadline: d })),
                            validator: validateDisableDate,
                        }}
                        legend="Fecha de limite"
                    />
                )}
            </BaseForm>
            <Popup isOpen={isOpenPopup} close={() => setOpenPopup(false)}>
                <div className="margin-bottom-25">
                    <h2 className="text | big-medium bolder">
                        Razón para{" "}
                        {isDisable
                            ? ENABLE_LABEL.toLowerCase()
                            : DISABLE_LABEL.toLowerCase()}
                    </h2>
                    <p className="text | light">
                        Escribe la razón por la cual estas{" "}
                        {isDisable
                            ? ENABLE_LABEL.toLowerCase()
                            : DISABLE_LABEL.toLowerCase()}{" "}
                        al usuario, recuerda que esta acción sera registrada.
                    </p>
                </div>

                <BaseForm
                    content={{
                        button: {
                            content: {
                                legend: isDisable
                                    ? ENABLE_LABEL
                                    : DISABLE_LABEL,
                                buttonClassStyle: `general-button ${
                                    isDisable ? "green" : "yellow"
                                }`,
                            },
                            behavior: {
                                loading: formState.loading,
                                isValid: formState.isValid,
                            },
                        },
                    }}
                    behavior={{
                        loading: formState.loading || loading,
                        onSummit: handleSubmit,
                    }}
                >
                    <TextField
                        field={{
                            values: form.reason,
                            setter: (d) =>
                                setForm((prev) => ({
                                    ...prev,
                                    reason: d,
                                })),
                            validator: isValidChangeReason,
                        }}
                        legend="Razón de la acción"
                    />
                </BaseForm>
            </Popup>
        </div>
    );
};

export default FormToDisableUserByDateByAdmin;
