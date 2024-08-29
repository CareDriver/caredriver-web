import { Enterprise, EnterpriseUser } from "@/interfaces/Enterprise";
import { UserInterface } from "@/interfaces/UserInterface";
import { updateEnterprise } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import BaseForm from "@/components/form/view/forms/BaseForm";
import TextField from "@/components/form/view/fields/TextField";
import { validateEmialWithComparison } from "@/components/app_modules/users/validators/for_confirmations/DataConfirmationValidator";
import UserPhotoRenderer from "@/components/app_modules/users/views/data_renderers/for_user_data/UserPhotoRenderer";

interface Props {
    userToAdd: UserInterface;
    enterprise: Enterprise;
}

const NewUserSupportForm: React.FC<Props> = ({ userToAdd, enterprise }) => {
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [emailVerification, setEmailVerification] =
        useState<TextFieldForm>(DEFAUL_TEXT_FIELD);

    const registerAsSupport = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        if (!formState.loading) {
            setFormState((prev) => ({
                ...prev,
                loading: true,
            }));
            if (
                isValidTextField(emailVerification) &&
                enterprise.id &&
                userToAdd.id
            ) {
                let newSupportUser: EnterpriseUser = {
                    userId: userToAdd.id,
                    role: "support",
                };
                await toast.promise(
                    updateEnterprise(enterprise.id, {
                        addedUsersId: enterprise.addedUsersId
                            ? [
                                  ...enterprise.addedUsersId,
                                  newSupportUser.userId,
                              ]
                            : [newSupportUser.userId],
                        addedUsers: enterprise.addedUsers
                            ? [...enterprise.addedUsers, newSupportUser]
                            : [newSupportUser],
                    }),
                    {
                        pending: "Registrando al usuario como soporte",
                        success: "Nuevo usuario soporte agregado",
                        error: "Error al registrar al usuario como soporte, intentalo de nuevo por favor",
                    },
                );
                window.location.reload();
                setFormState((prev) => ({
                    ...prev,
                    loading: false,
                }));
            } else {
                toast.error("Completa el formulario con datos validos");
                setFormState((prev) => ({
                    ...prev,
                    loading: false,
                }));
            }
        }
    };

    useEffect(() => {
        setFormState({
            ...formState,
            isValid: isValidTextField(emailVerification),
        });
    }, [emailVerification]);

    return (
        <div className="service-form-wrapper">
            <div>
                <h1 className="text | big bolder">Agregar usuario soporte</h1>
                <p className="text | light">
                    El usuario podra ayudarte a administrar los usuarios del
                    servicio.
                </p>
            </div>

            <div className="users-item | margin-top-25">
                <UserPhotoRenderer photo={userToAdd.photoUrl} />
                <div>
                    <h2 className="text | bolder big-medium-v2 capitalize">
                        {userToAdd.fullName}
                    </h2>
                    <h4 className="text | light">{userToAdd.email}</h4>
                    <h4 className="text | light">{userToAdd.location}</h4>
                </div>
            </div>
            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: "Agregar como usuario soporte",
                        },
                        behavior: {
                            isValid: formState.isValid,
                            loading: formState.loading,
                        },
                    },
                }}
                behavior={{
                    loading: formState.loading,
                    onSummit: registerAsSupport,
                }}
            >
                <TextField
                    field={{
                        values: emailVerification,
                        setter: setEmailVerification,
                        validator: (d) =>
                            validateEmialWithComparison(d, userToAdd.email),
                    }}
                    legend="Correo electrónico | Confirmacion"
                />
            </BaseForm>
        </div>
    );
};

export default NewUserSupportForm;
