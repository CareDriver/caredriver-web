"use client";
import { UserInterface } from "@/interfaces/UserInterface";
import {
    checkEmailExists,
    updateUser,
} from "@/components/app_modules/users/api/UserRequester";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import BaseForm from "@/components/form/view/forms/BaseForm";
import {
    AttachmentField,
    TextField as TextFieldForm,
} from "@/components/form/models/FormFields";
import { isNullOrEmptyText } from "@/validators/TextValidator";
import {
    isValidAttachmentField,
    isValidTextField,
} from "@/components/form/validators/FieldValidators";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import FieldDeleted from "@/components/form/view/field_renderers/FieldDeleted";
import TextField from "@/components/form/view/fields/TextField";
import EmailField from "@/components/form/view/fields/EmailField";
import PasswordField from "@/components/form/view/fields/PasswordField";
import {
    isValidName,
    isValidPassword,
} from "../../../validators/for_data/CredentialsValidator";
import Pen from "@/icons/Pen";
import ImageUploader from "@/components/form/view/attachment_fields/ImageUploader";
import { isImageBase64 } from "@/validators/ImageValidator";
import { deleteFile, uploadFileBase64 } from "@/utils/requesters/FileUploader";
import { RefAttachment } from "@/components/form/models/RefAttachment";
import { DirectoryPath } from "@/firebase/StoragePaths";

interface Form {
    email: TextFieldForm;
    password: TextFieldForm;
    fullName: TextFieldForm;
    photo: AttachmentField;
}

interface Props {
    user: UserInterface;
}

const FormToUpdateUserData: React.FC<Props> = ({ user }) => {
    const [form, setForm] = useState<Form>(userToForm(user));
    const [formState, setFormState] = useState<FormState>({
        ...DEFAULT_FORM_STATE,
        isValid: false,
    });

    const changePhoto = async () => {
        if (!form.photo.value || !isImageBase64(form.photo.value)) {
            return;
        }

        let hadPhoto =
            !isNullOrEmptyText(user.photoUrl.url) &&
            !isNullOrEmptyText(user.photoUrl.ref);
        let newPhoto: RefAttachment = await toast.promise(
            uploadFileBase64(DirectoryPath.Users, form.photo.value),
            {
                pending: `${
                    hadPhoto ? "Cambiando" : "Subiendo"
                } foto de perfil`,
                success: `Foto de perfil ${hadPhoto ? "cambiada" : "subida"}`,
                error: `Error al ${
                    hadPhoto ? "cambiar" : "subir"
                } la foto de perfil, inténtalo de nuevo por favor`,
            },
        );

        if (hadPhoto) {
            await toast.promise(deleteFile(user.photoUrl.ref), {
                pending: "Eliminado antigua foto de perfil",
                success: "Antigua foto eliminada",
                error: "Error al eliminar la antigua foto de perfil, inténtalo de nuevo por favor",
            });
        }

        return newPhoto;
    };

    const editCredentials = async () => {
        if (!user.id || !user.email) {
            return;
        }

        try {
            let newEmail = user.email;
            if (user.email !== form.email.value) {
                let amountOfUsers = await checkEmailExists(
                    form.email.value.trim().toLocaleLowerCase(),
                );

                if (amountOfUsers > 0) {
                    setForm((prev) => ({
                        ...prev,
                        email: {
                            ...prev.email,
                            message: "El correo ya fue registrado",
                        },
                    }));
                    setFormState((prev) => ({
                        ...prev,
                        loading: false,
                        isValid: false,
                    }));
                    return;
                } else {
                    await updateUser(user.id, {
                        email: form.email.value.toLocaleLowerCase(),
                    });
                    newEmail = form.email.value.trim().toLocaleLowerCase();
                }
            }

            if (!isNullOrEmptyText(form.password.value)) {
                await fetch("/api/credentials", {
                    method: "POST",
                    body: JSON.stringify({
                        userId: user.id,
                        email: user.email,
                        newEmail: newEmail,
                        password: form.password.value.trim(),
                    }),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });
            }

            window.location.reload();
        } catch (e) {}
    };

    const editPersonalData = async () => {
        if (!user.id || !personalDataWasChanged(form, user)) {
            return;
        }

        const fullNameChanged: boolean = user.fullName !== form.fullName.value;
        const photoWasChanged: boolean =
            form.photo.value !== undefined && isImageBase64(form.photo.value);

        let userNewData: Partial<UserInterface> = {};

        if (fullNameChanged) {
            userNewData = {
                ...userNewData,
                fullName: form.fullName.value
                    .toLocaleLowerCase()
                    .trimEnd()
                    .trimStart(),
            };
        }

        if (photoWasChanged) {
            const newPhoto = await changePhoto();
            userNewData = {
                ...userNewData,
                photoUrl: newPhoto,
            };
        }

        try {
            await toast.promise(updateUser(user.id, userNewData), {
                pending: "Guardando cambios...",
                success: "Cambios guardados",
                error: "Error al guardar cambios, inténtalo de nuevo por favor",
            });
            if (!creditialsWasChanged(form, user)) {
                window.location.reload();
            }
        } catch (e) {}
    };

    const onSummit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formState.loading) {
            if (!hasChanges(form, user)) {
                toast.info("Sin cambios para actualizar...", {
                    toastId: "no-changes-for-update-profile",
                });
                return;
            }

            setFormState((prev) => ({
                ...prev,
                loading: true,
            }));

            if (!isValidForm(form)) {
                toast.warning("Formulario invalido");
                setFormState((prev) => ({
                    ...prev,
                    loading: false,
                }));
                return;
            }

            try {
                await editPersonalData();

                if (creditialsWasChanged(form, user)) {
                    await toast.promise(editCredentials(), {
                        pending: "Cambiando credenciales...",
                        success: "Credenciales cambiadas",
                        error: "Error al cambiar credenciales, inténtalo de nuevo por favor",
                    });
                }
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
                <h2 className="text | bold medium-big | icon-wrapper">
                    <Pen /> Actualización de datos
                </h2>
                <p className="text | light">
                    Solo se actualizara los <b>datos que sean diferentes</b> a
                    los datos actuales y que sean validos.{" "}
                    <b>
                        Tendrás que volver a iniciar sesión si cambias tus
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
                    onSummit: onSummit,
                }}
            >
                <ImageUploader
                    content={{
                        id: "admin-profile-update-photo",
                        imageInCircle: true,
                        legend: "Foto de perfil",
                    }}
                    uploader={{
                        image: form.photo,
                        setImage: (p) =>
                            setForm((prev) => ({ ...prev, photo: p })),
                    }}
                />
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
                    autoFill="new-email"
                />
                <PasswordField
                    values={form.password}
                    setter={(d) =>
                        setForm((prev) => ({ ...prev, password: d }))
                    }
                    autoFill="new-password"
                />
            </BaseForm>
        </div>
    );
};

export default FormToUpdateUserData;

function userToForm(user: UserInterface): Form {
    return {
        email: {
            value: user.email ?? "",
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
        photo: {
            value: isNullOrEmptyText(user.photoUrl.url)
                ? undefined
                : user.photoUrl.url,
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
    let namedWasChanged: boolean =
        form.fullName.value.toLocaleLowerCase() !==
        user.fullName.toLocaleLowerCase();
    let photoWasChanged: boolean =
        form.photo.value !== undefined && isImageBase64(form.photo.value);

    return namedWasChanged || photoWasChanged;
}

function hasChanges(form: Form, user: UserInterface): boolean {
    return (
        creditialsWasChanged(form, user) || personalDataWasChanged(form, user)
    );
}

function isValidForm(form: Form): boolean {
    return (
        isValidTextField(form.fullName) &&
        isValidTextField(form.email) &&
        (isNullOrEmptyText(form.photo.value) ||
            isValidAttachmentField(form.photo)) &&
        (isNullOrEmptyText(form.password.value) ||
            isValidTextField(form.password))
    );
}
