"use client";

import TriangleExclamation from "@/icons/TriangleExclamation";
import {
    FormEvent,
    SyntheticEvent,
    useContext,
    useEffect,
    useState,
} from "react";
import { UserInterface } from "@/interfaces/UserInterface";
import { toast } from "react-toastify";
import { saveActionOnUser } from "@/components/app_modules/users/api/ActionOnUserRegister";
import { ActionOnUserPerformed } from "@/interfaces/ActionOnUserInterface";
import { Timestamp } from "firebase/firestore";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import Popup from "@/components/modules/Popup";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import { PageStateContext } from "@/context/PageStateContext";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import TextField from "@/components/form/view/fields/TextField";
import { isValidChangeReason } from "@/components/app_modules/users/validators/for_data/BalanceValidator";
import { validateEmialWithComparison } from "../../../validators/for_confirmations/DataConfirmationValidator";
import { genDocId } from "@/utils/generators/IdGenerator";
import { isValidTextField } from "@/components/form/validators/FieldValidators";

interface Form {
    confirmation: TextFieldForm;
    reason: TextFieldForm;
}

const DEFAULT_FORM: Form = {
    reason: DEFAUL_TEXT_FIELD,
    confirmation: DEFAUL_TEXT_FIELD,
};

interface Props {
    user: UserInterface;
    adminUser: UserInterface;
}

const FormToDisableUserByAdmin: React.FC<Props> = ({ user, adminUser }) => {
    const isDisable = user.disable ? user.disable : false;
    const [isOpenPopup, setOpenPopup] = useState(false);
    const { loading, setLoadingAll } = useContext(PageStateContext);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [form, setForm] = useState<Form>(DEFAULT_FORM);

    const toggleDisableUser = async () => {
        if (user.id) {
            if (isDisable) {
                try {
                    await toast.promise(
                        updateUser(user.id, {
                            disable: false,
                        }),
                        {
                            pending: "Habilitando al usuario",
                            success: "Usuario habilitado",
                            error: "Error al volver a habilitar al usuario, inténtalo de nuevo",
                        },
                    );
                } catch (e) {
                    console.log(e);
                }
            } else {
                try {
                    await toast.promise(
                        updateUser(user.id, {
                            disable: true,
                        }),
                        {
                            pending: "Deshabilitando al usuario",
                            success: "Usuario deshabilitado",
                            error: "Error al deshabilitar al usuario, inténtalo de nuevo",
                        },
                    );
                } catch (e) {
                    console.log(e);
                }
            }

            try {
                await toast.promise(
                    fetch("/api/userstate", {
                        method: "POST",
                        body: JSON.stringify({
                            userId: user.id,
                            state: !isDisable,
                        }),
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    }),
                    {
                        pending: isDisable
                            ? "Habilitando la authentication del usuario"
                            : "Deshabilitando la authentication del usuario",
                        success: isDisable ? "Habilitado" : "Deshabilitado",
                        error: isDisable
                            ? "Error al habilitar la authentication del usuario, inténtalo de nuevo por favor"
                            : "Error al deshabilitar la authentication del usuario, inténtalo de nuevo por favor",
                    },
                );
                window.location.reload();
            } catch (e) {
                console.log(e);
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
                setLoadingAll(false, setFormState);
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
                    isValidTextField(form.reason),
            }));
        } else {
            setFormState((prev) => ({
                ...prev,
                isValid: isValidTextField(form.confirmation),
            }));
        }
    }, [form]);

    return (
        <div className={`form-sub-container | margin-top-50 max-width-40`}>
            <h2 className="text medium-big bolder yellow | icon-wrapper yellow-icon">
                <TriangleExclamation />
                {isDisable ? "Habilitar usuario" : "Deshabilitar usuario"}
            </h2>
            <p>
                El usuario no podra usar la aplicacion mientras este
                desabilitando.
            </p>

            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: isDisable
                                ? "Habilitar usuario"
                                : "Deshabilitar usuario",
                            buttonClassStyle:
                                "small-general-button yellow | text bolder",
                        },
                        behavior: {
                            loading: formState.loading,
                            isValid: formState.isValid,
                        },
                    },
                    styleClasses: "small-form",
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
            </BaseForm>
            <Popup isOpen={isOpenPopup} close={() => setOpenPopup(false)}>
                <div className="margin-bottom-25">
                    <h2 className="text | big-medium bolder">
                        Razón para {isDisable ? "habilitar" : "deshabilitar"} al
                        usuario
                    </h2>
                    <p className="text | light">
                        Escribe la razón por la cual estas{" "}
                        {isDisable ? "habilitando" : "deshabilitando"} al
                        usuario, recuerda que esta acción sera registrada.
                    </p>
                </div>

                <BaseForm
                    content={{
                        button: {
                            content: {
                                legend: isDisable
                                    ? "Habilitar usuario"
                                    : "Deshabilitar usuario",
                                buttonClassStyle: "general-button yellow"
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

export default FormToDisableUserByAdmin;
