"use client";

import "react-international-phone/style.css";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpWithRoleAndPhoto } from "./models/SignUpSignatures";
import { InputValidator } from "@/utils/validator/InputValidator";
import {
    createUserDataWithPhoto,
    handleInputChangeV2,
} from "@/utils/auth/UserAuth";
import { isValidName } from "@/components/app_modules/users/validators/CredentialsValidator";
import {
    isNotEmpty,
    thereAreNotErrorsSignUp,
} from "@/utils/validator/auth/SignUpValidator";
import { toast } from "react-toastify";
import { UserInterface, UserRoleRender } from "@/interfaces/UserInterface";
import { checkEmailExists, saveUser } from "@/utils/requests/UserRequester";
import { uploadFileBase64 } from "@/utils/requests/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";
import { nanoid } from "nanoid";
import EmailField from "@/components/form/view/fields/EmailField";
import PasswordField from "@/components/form/view/fields/PasswordField";
import TextField from "@/components/form/view/fields/TextField";
import PhoneField from "@/components/form/view/fields/PhoneField";
import LocationField from "@/components/form/view/fields/LocationField";
import UserRoleField from "@/components/form/view/fields/UserRoleField";
import ImageUploader from "@/components/form/view/attachment_fields/ImageUploader";
import { DEFAULT_SING_UP_WITH_ROLE_AND_PHOTO } from "./models/DefaultSignUp";

const UserRegistration = () => {
    const router = useRouter();
    const [formState, setFormState] = useState({
        loading: false,
        isValid: true,
    });
    const [form, setForm] = useState<SignUpWithRoleAndPhoto>(
        DEFAULT_SING_UP_WITH_ROLE_AND_PHOTO,
    );

    const createData = async (id: string, fakeId: string) => {
        var photoRef = null;

        if (form.photo.value && !form.photo.message) {
            photoRef = await toast.promise(
                uploadFileBase64(DirectoryPath.Users, form.photo.value),
                {
                    pending: "Subiendo foto de perfil",
                    success: "Foto de perfil subido",
                    error: "Error al subir la foto de perfil, inténtalo de nuevo por favor",
                },
            );
        }

        const newUserData: UserInterface = createUserDataWithPhoto(
            id,
            fakeId,
            form.role,
            form,
            photoRef,
        );

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
                email: form.email.value,
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
            setFormState({
                ...formState,
                loading: true,
            });

            if (isNotEmpty(form)) {
                if (thereAreNotErrorsSignUp(form)) {
                    try {
                        const amountOfUsers = await checkEmailExists(
                            form.email.value,
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
                            toast.error(
                                "El correo ya fue registrado, inicia sesión",
                            );
                        } else {
                            const userId = await toast.promise(register(), {
                                pending:
                                    "Creando método de authentication para el usuario",
                                success: "Creado",
                                error: "Error al crear método de authentication",
                            });
                            const fakeId = nanoid(30);
                            if (userId) {
                                await toast.promise(
                                    createData(userId, fakeId),
                                    {
                                        pending: `Creando nuevo usuario ${
                                            UserRoleRender[form.role]
                                        }`,
                                        success: `Usuario ${
                                            UserRoleRender[form.role]
                                        } creado`,
                                        error: "Error al crear el nuevo usuario, inténtalo de nuevo por favor",
                                    },
                                );
                                router.push("/admin/users");
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
                } else {
                    setFormState({
                        ...formState,
                        isValid: false,
                        loading: false,
                    });
                    toast.error(
                        "Por favor completa los campos con datos validos",
                    );
                }
            } else {
                setFormState({
                    ...formState,
                    isValid: false,
                    loading: false,
                });
                toast.error("Por favor completa los campos");
            }
        }
    };

    const getInputHandler = (
        e: React.ChangeEvent<HTMLInputElement>,
        validationFunction: InputValidator,
    ) => {
        return handleInputChangeV2(e, validationFunction, form, setForm);
    };

    useEffect(() => {
        setFormState({
            ...formState,
            isValid: thereAreNotErrorsSignUp(form),
        });
    }, [form]);

    return (
        <div className="render-data-wrapper | max-width-60">
            <h1 className="text | big bolder margin-bottom-50">
                Registrar Nuevo Usuario
            </h1>
            <form
                onSubmit={handleSummit}
                className="form-container | full-form"
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
            </form>
            <button
                className="general-button | touchable margin-top-25 touchable"
                data-theme="dark"
                disabled={!formState.isValid}
            >
                {formState.loading ? (
                    <i className="loader"></i>
                ) : (
                    <span>Registrar</span>
                )}
            </button>
        </div>
    );
};

export default UserRegistration;
