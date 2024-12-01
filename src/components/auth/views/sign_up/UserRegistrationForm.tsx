"use client";

import "react-international-phone/style.css";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    UserInterface,
    UserRole,
    USER_ROLE_TO_SPANISH,
} from "@/interfaces/UserInterface";
import {
    checkEmailExists,
    saveUser,
} from "@/components/app_modules/users/api/UserRequester";
import { uploadFileBase64 } from "@/utils/requesters/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import EmailField from "@/components/form/view/fields/EmailField";
import PasswordField from "@/components/form/view/fields/PasswordField";
import TextField from "@/components/form/view/fields/TextField";
import PhoneField from "@/components/form/view/fields/PhoneField";
import LocationField from "@/components/form/view/fields/LocationField";
import UserRoleField from "@/components/form/view/fields/UserRoleField";
import ImageUploader from "@/components/form/view/attachment_fields/ImageUploader";
import {
    AttachmentField,
    TextField as TextFieldForm,
} from "../../../form/models/FormFields";
import {
    DEFAUL_ATTACHMENT_FIELD,
    DEFAUL_TEXT_FIELD,
} from "../../../form/models/DefaultFields";
import { Locations } from "@/interfaces/Locations";
import { isValidTextField } from "../../../form/validators/FieldValidators";
import { EMPTY_USER_DATA } from "../../api/UserAuth";
import { isValidName } from "../../../app_modules/users/validators/for_data/CredentialsValidator";
import { genFakeId } from "@/utils/generators/IdGenerator";
import BaseForm from "../../../form/view/forms/BaseForm";
import { DEFAULT_FORM_STATE, FormState } from "../../../form/models/Forms";
import { parseBoliviaPhone } from "@/utils/helpers/PhoneHelper";

interface Form {
    fullName: TextFieldForm;
    phone: TextFieldForm;
    email: TextFieldForm;
    password: TextFieldForm;
    location: Locations;
    role: UserRole;
    photo: AttachmentField;
}

const UserRegistrationForm = () => {
    const [form, setForm] = useState<Form>(DEFAULT_FORM);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);

    const createData = async (id: string, fakeId: string) => {
        let newUserData: UserInterface = {
            ...formToNewUser(form),
            id,
            fakeId,
        };

        if (form.photo.value && !form.photo.message) {
            let photoRef = await toast.promise(
                uploadFileBase64(DirectoryPath.Users, form.photo.value),
                {
                    pending: "Subiendo foto de perfil",
                    success: "Foto de perfil subido",
                    error: "Error al subir la foto de perfil, inténtalo de nuevo por favor",
                },
            );
            if (photoRef) {
                newUserData = {
                    ...newUserData,
                    photoUrl: photoRef,
                };
            }
        }

        saveUser(id, newUserData)
            .then(() => {
                setFormState({
                    ...formState,
                    loading: false,
                });
                toast.success("Registro exitoso");
            })
            .catch(() => {
                setFormState({
                    ...formState,
                    loading: false,
                });
            });
    };

    const register = async (): Promise<string | null> => {
        const res = await fetch("/api/firebase", {
            method: "POST",
            body: JSON.stringify({
                email: form.email.value.toLocaleLowerCase(),
                password: form.password.value,
            }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        return data.userId;
    };

    const handleSummit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formState.loading) {
            setFormState((prev) => ({
                ...prev,
                loading: true,
            }));

            if (!isValidForm(form)) {
                toast.error("Formulario invalido");
                setFormState((prev) => ({
                    ...prev,
                    loading: false,
                }));
                return;
            }

            try {
                const amountOfUsers = await checkEmailExists(
                    form.email.value.toLocaleLowerCase(),
                );

                if (amountOfUsers > 0) {
                    setFormState({
                        ...formState,
                        isValid: false,
                        loading: false,
                    });
                    setForm({
                        ...form,
                        email: {
                            ...form.email,
                            message: "El correo ya fue registrado",
                        },
                    });
                    toast.error("El correo ya fue registrado, inicia sesión");
                } else {
                    const userId = await toast.promise(register(), {
                        pending: "Creando método de authentication",
                        success: "Creado",
                        error: "Error al crear método de authentication",
                    });
                    const fakeId = genFakeId();
                    if (userId) {
                        await toast.promise(createData(userId, fakeId), {
                            pending: `Creando nuevo usuario ${
                                USER_ROLE_TO_SPANISH[form.role]
                            }`,
                            success: `Usuario ${
                                USER_ROLE_TO_SPANISH[form.role]
                            } creado`,
                            error: "Error al crear el nuevo usuario, inténtalo de nuevo por favor",
                        });
                    } else {
                        setFormState({
                            ...formState,
                            isValid: false,
                            loading: false,
                        });
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    };

    useEffect(() => {
        setFormState((prev) => ({
            ...prev,
            isValid: isValidForm(form),
        }));
    }, [form]);

    return (
        <div className="render-data-wrapper | max-width-60">
            <h1 className="text | big bold">Registrar Nuevo Usuario</h1>
            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: "Registrar",
                        },
                        behavior: {
                            loading: formState.loading,
                            isValid: formState.isValid,
                        },
                    },
                }}
                behavior={{
                    loading: formState.loading,
                    onSummit: handleSummit,
                }}
            >
                <EmailField
                    values={form.email}
                    setter={(e) => setForm((prev) => ({ ...prev, email: e }))}
                />
                <PasswordField
                    values={form.password}
                    setter={(e) =>
                        setForm((prev) => ({ ...prev, password: e }))
                    }
                />
                <TextField
                    field={{
                        values: form.fullName,
                        setter: (e) =>
                            setForm((prev) => ({ ...prev, fullName: e })),
                        validator: isValidName,
                    }}
                    legend="Nombre completo"
                />
                <PhoneField
                    values={form.phone}
                    setter={(e) => setForm((prev) => ({ ...prev, phone: e }))}
                />
                <LocationField
                    location={form.location}
                    setter={(e) =>
                        setForm((prev) => ({ ...prev, location: e }))
                    }
                />
                <UserRoleField
                    role={form.role}
                    setter={(e) => setForm((prev) => ({ ...prev, role: e }))}
                    roles={[
                        UserRole.Support,
                        UserRole.SupportTwo,
                        UserRole.BalanceRecharge,
                    ]}
                />
                <ImageUploader
                    content={{
                        id: "register-new-user-photo",
                        legend: "Foto de perfil (Opcional)",
                        imageInCircle: true,
                    }}
                    uploader={{
                        image: form.photo,
                        setImage: (e) =>
                            setForm((prev) => ({ ...prev, photo: e })),
                    }}
                />
            </BaseForm>
        </div>
    );
};

export default UserRegistrationForm;

export const DEFAULT_FORM: Form = {
    fullName: DEFAUL_TEXT_FIELD,
    phone: DEFAUL_TEXT_FIELD,
    email: DEFAUL_TEXT_FIELD,
    password: DEFAUL_TEXT_FIELD,
    location: Locations.CochabambaBolivia,
    role: UserRole.Support,
    photo: DEFAUL_ATTACHMENT_FIELD,
};

const isValidForm = (form: Form): boolean => {
    return (
        isValidTextField(form.email) &&
        isValidTextField(form.password) &&
        isValidTextField(form.fullName) &&
        isValidTextField(form.phone)
    );
};

function formToNewUser(form: Form): UserInterface {
    let userData: UserInterface = {
        ...EMPTY_USER_DATA,
        fullName: form.fullName.value.toLocaleLowerCase().trimEnd().trimStart(),
        phoneNumber: parseBoliviaPhone(form.phone.value),
        location: form.location,
        email: form.email.value.toLocaleLowerCase().trim(),
        role: form.role,
    };

    return userData;
}
