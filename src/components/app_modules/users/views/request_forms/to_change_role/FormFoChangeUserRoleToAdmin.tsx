"use client";

import UserLock from "@/icons/UserLock";
import { UserInterface, UserRole, userRoles } from "@/interfaces/UserInterface";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import {
    FormEvent,
    useContext,
    useEffect,
    useState,
} from "react";
import { toast } from "react-toastify";
import { saveActionOnUser } from "@/components/app_modules/users/api/ActionOnUserRegister";
import { nanoid } from "nanoid";
import { Timestamp } from "firebase/firestore";
import { ActionOnUserPerformed } from "@/interfaces/ActionOnUserInterface";
import { PageStateContext } from "@/context/PageStateContext";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import Popup from "@/components/modules/Popup";
import BaseForm from "@/components/form/view/forms/BaseForm";
import TextField from "@/components/form/view/fields/TextField";
import UserRoleField from "@/components/form/view/fields/UserRoleField";
import { isValidChangeReason } from "@/validators/JustificationValidator";

interface Form {
    changeReason: TextFieldForm;
    newRole: UserRole;
}

const DEFAULT_FORM = (user: UserInterface): Form => {
    return {
        changeReason: DEFAUL_TEXT_FIELD,
        newRole: user.role ? user.role : UserRole.User,
    };
};

interface Props {
    user: UserInterface;
    adminUser: UserInterface;
}

const FormFoChangeUserRoleToAdmin: React.FC<Props> = ({ user, adminUser }) => {
    const { loading, setLoadingAll } = useContext(PageStateContext);
    const [isOpenPopup, setOpenPopup] = useState(false);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [form, setForm] = useState<Form>(DEFAULT_FORM(user));

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!loading) {
            setLoadingAll(true, setFormState);

            if (user.id && adminUser.id) {
                const actionOnUserDoc = nanoid(25);

                await toast.promise(
                    saveActionOnUser(actionOnUserDoc, {
                        id: actionOnUserDoc,
                        action: ActionOnUserPerformed[form.newRole],
                        datetime: Timestamp.now(),
                        performedById: adminUser.id,
                        userId: user.id,
                        traceId: nanoid(),
                        reason: form.changeReason.value,
                    }),
                    {
                        pending: "Registrando acción",
                        success: "Acción en el usuario registrada",
                        error: "Error al registrar acción en el usuario",
                    },
                );

                await toast.promise(
                    updateUser(user.id, { role: form.newRole }),
                    {
                        pending: "Cambiando el rol del usuario",
                        success: "Rol del usuario cambiado",
                        error: "Error al cambiar el rol del usuario, inténtalo de nuevo por favor",
                    },
                );
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
                isValid: isValidTextField(form.changeReason),
            }));
        } else {
            setFormState((prev) => ({
                ...prev,
                isValid: user.role !== form.newRole,
            }));
        }
    }, [form]);

    return (
        <section className="profile-info-wrapper | margin-top-50 max-width-60">
            <h2 className="icon-wrapper lb | text medium-big bold">
                <UserLock />
                Rol del Usuario
            </h2>

            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: "Cambiar rol",
                            buttonClassStyle:
                                "small-general-button | text bold",
                        },
                        behavior: {
                            loading: formState.loading,
                            isValid: formState.isValid,
                        },
                    },
                    styleClasses: "small-form | max-width-40",
                }}
                behavior={{
                    loading: formState.loading || loading,
                    onSummit: async (e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        setOpenPopup(true);
                    },
                }}
            >
                <UserRoleField
                    role={form.newRole}
                    setter={(d) => setForm((prev) => ({ ...prev, newRole: d }))}
                    roles={[
                        UserRole.User,
                        UserRole.BalanceRecharge,
                        UserRole.Support,
                        UserRole.SupportTwo,
                    ]}
                />
            </BaseForm>
            <Popup isOpen={isOpenPopup} close={() => setOpenPopup(false)}>
                <div className="margin-bottom-25">
                    <h2 className="text | big-medium bold">
                        Razón del cambio de rol
                    </h2>
                    <p className="text | light">
                        Escribe la razón por la cual estas haciendo este cambio
                        en el usuario, recuerda que esta acción sera registrada.
                    </p>
                </div>

                <BaseForm
                    content={{
                        button: {
                            content: {
                                legend: "Cambiar rol",
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
                            values: form.changeReason,
                            setter: (d) =>
                                setForm((prev) => ({
                                    ...prev,
                                    changeReason: d,
                                })),
                            validator: isValidChangeReason,
                        }}
                        legend="Razón de la acción"
                    />
                </BaseForm>
            </Popup>
        </section>
    );
};

export default FormFoChangeUserRoleToAdmin;
