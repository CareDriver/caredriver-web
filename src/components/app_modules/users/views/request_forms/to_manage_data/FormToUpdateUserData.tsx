"use client";
import { UserInterface } from "@/interfaces/UserInterface";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { isNullOrEmptyText } from "@/validators/TextValidator";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import FieldDeleted from "@/components/form/view/field_renderers/FieldDeleted";
import TextField from "@/components/form/view/fields/TextField";
import EmailField from "@/components/form/view/fields/EmailField";
import PasswordField from "@/components/form/view/fields/PasswordField";
import { isValidName } from "../../../validators/for_data/CredentialsValidator";

interface Form {
    email: TextFieldForm;
    password: TextFieldForm;
    fullName: TextFieldForm;
}

interface Props {
    user: UserInterface;
}

const FormToUpdateUserData: React.FC<Props> = ({ user }) => {
    const [form, setForm] = useState<Form>(userToForm(user));
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

    const editCredentials = async () => {
        if (!user.id || !user.email) {
            return;
        }

        try {
            if (!isNullOrEmptyText(form.password.value)) {
                await fetch("/api/credentials", {
                    method: "POST",
                    body: JSON.stringify({
                        userId: user.id,
                        email: user.email,
                        newEmail: form.email.value,
                        password: form.password.value,
                    }),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });
            }
            if (user.email !== form.email.value) {
                await updateUser(user.id, {
                    email: form.email.value.toLocaleLowerCase(),
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    const editPersonalData = async () => {
        if (user.id) {
            try {
                await toast.promise(
                    updateUser(user.id, {
                        fullName: form.fullName.value.toLocaleLowerCase(),
                    }),
                    {
                        pending: "Cambiando nombre...",
                        success: "Nombre cambiado",
                        error: "Error al cambiar el nombre, inténtalo de nuevo por favor",
                    },
                );
            } catch (e) {
                console.log(e);
            }
        }
    };

    const editData = async () => {
        if (!formState.loading) {
            if (!hasChanges(form, user)) {
                toast.info("Sin cambios para actualizar...");
                return;
            }

            setFormState((prev) => ({
                ...prev,
                loading: true,
            }));

            try {
                const fullNameChanged: boolean =
                    user.fullName !== form.fullName.value;
                if (creditialsWasChanged(form, user)) {
                    await toast.promise(editCredentials(), {
                        pending: "Cambiando credenciales...",
                        success: "Credenciales cambiadas",
                        error: "Error al cambiar credenciales, inténtalo de nuevo por favor",
                    });
                }

                if (fullNameChanged) {
                    await editPersonalData();
                }
                window.location.reload();
            } catch (e) {
                setFormState((prev) => ({
                    ...prev,
                    loading: false,
                }));
            }
        }
    };

    useEffect(() => {
        setFormState((prev) => ({
            ...prev,
            isValid: isValidForm(form),
        }));
    }, [form]);

    if (!user.email || !user.id) {
        return (
            <FieldDeleted description="El usuario no fue correctamente registrado para poder actualizar su perfil" />
        );
    }

    return (
        <div className="form-container | full-form margin-top-50 max-width-60">
            <div className="margin-bottom-15">
                <h2 className="text | bold medium-big">
                    Actualizacion de datos
                </h2>
                <p className="text | light small">
                    Solo se actualizara los <b>datos que sean diferentes</b> a
                    los datos actuales y que sean validos.{" "}
                    <b>
                        Tendras que volver a authenticarte si cambias tus
                        credenciales
                    </b>
                </p>
            </div>
            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: "Cambiar datos",
                        },
                        behavior: {
                            loading: formState.loading,
                            isValid: formState.isValid,
                        },
                    },
                }}
                behavior={{
                    loading: formState.loading,
                    onSummit: editData,
                }}
            >
                <TextField
                    field={{
                        values: form.fullName,
                        setter: (d) =>
                            setForm((prev) => ({ ...prev, fullName: d })),
                        validator: isValidName,
                    }}
                    legend="Nombre completo"
                />
                <EmailField
                    values={form.email}
                    setter={(d) => setForm((prev) => ({ ...prev, email: d }))}
                />
                <PasswordField
                    values={form.password}
                    setter={(d) =>
                        setForm((prev) => ({ ...prev, password: d }))
                    }
                />
            </BaseForm>
        </div>
    );
};

export default FormToUpdateUserData;

function userToForm(user: UserInterface): Form {
    return {
        email: {
            value: user.email ? user.email : "",
            message: null,
        },
        password: {
            value: "",
            message: null,
        },
        fullName: {
            value: user.fullName,
            message: null,
        },
    };
}

function creditialsWasChanged(form: Form, user: UserInterface): boolean {
    return (
        form.email.value !== user.email ||
        !isNullOrEmptyText(form.password.value)
    );
}

function personalDataWasChanged(form: Form, user: UserInterface): boolean {
    return (
        form.fullName.value.toLocaleLowerCase() !==
        user.fullName.toLocaleLowerCase()
    );
}

function hasChanges(form: Form, user: UserInterface): boolean {
    return (
        creditialsWasChanged(form, user) || personalDataWasChanged(form, user)
    );
}

function isValidForm(form: Form): boolean {
    return (
        isValidTextField(form.email) &&
        isValidTextField(form.fullName) &&
        isValidTextField(form.password)
    );
}
