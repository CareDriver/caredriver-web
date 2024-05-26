"use client";

import "react-international-phone/style.css";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultSignUpV2Values, SignUpInterfaceV2 } from "./AuthInterfaces";
import { InputValidator } from "@/utils/validator/InputValidator";
import {
    createUserDataWithPhoto,
    getLocation,
    getRole,
    handleInputChangeV2,
    validatePhoneV2,
} from "@/utils/auth/UserAuth";
import {
    isValidEmail,
    isValidName,
    isValidPassword,
} from "@/utils/validator/auth/CredentialsValidator";
import {
    isNotEmpty,
    thereAreNotErrorsSignUp,
} from "@/utils/validator/auth/SignUpValidator";
import { toast } from "react-toastify";
import { UserInterface, UserRole, UserRoleRender } from "@/interfaces/UserInterface";
import { checkEmailExists, saveUser } from "@/utils/requests/UserRequester";
import SignUpFormV2 from "./SignUpFormV2";
import { PhotoField } from "../services/FormModels";
import { uploadFileBase64 } from "@/utils/requests/FileUploader";
import { DirectoryPath } from "@/firebase/StoragePaths";

const UserRegistration = () => {
    const router = useRouter();
    const [formState, setFormState] = useState({
        loading: false,
        isValid: true,
    });
    const [credentials, setCredentials] =
        useState<SignUpInterfaceV2>(defaultSignUpV2Values);
    const rolesToRegister = [
        UserRole.Support,
        UserRole.SupportTwo,
        UserRole.BalanceRecharge,
    ];

    const createData = async (id: string) => {
        var photoRef = null;

        if (credentials.photo.value && !credentials.photo.message) {
            photoRef = await toast.promise(
                uploadFileBase64(DirectoryPath.Users, credentials.photo.value),
                {
                    pending: "Subiendo foto de perfil",
                    success: "Foto de perfil subido",
                    error: "Error al subir la foto de perfil, intentalo de nuevo por favor",
                },
            );
        }

        const newUserData: UserInterface = createUserDataWithPhoto(
            id,
            credentials.role,
            credentials,
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
                email: credentials.email.value,
                password: credentials.password.value,
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
        setFormState({
            ...formState,
            loading: true,
        });

        if (isNotEmpty(credentials)) {
            if (thereAreNotErrorsSignUp(credentials)) {
                try {
                    const amountOfUsers = await checkEmailExists(credentials.email.value);

                    if (amountOfUsers > 0) {
                        setFormState({
                            ...formState,
                            isValid: false,
                            loading: false,
                        });
                        setCredentials({
                            ...credentials,
                            email: {
                                ...credentials.email,
                                errorMessage: "El correo ya fue registrado",
                            },
                        });
                        toast.error("El correo ya fue registrado, inicia sesion");
                    } else {
                        const userId = await toast.promise(register(), {
                            pending: "Creando metodo de authenticacion para el usuario",
                            success: "Creado",
                            error: "Error al crear metodo de authenticacion",
                        });
                        if (userId) {
                            await toast.promise(createData(userId), {
                                pending: `Creando nuevo usuario ${
                                    UserRoleRender[credentials.role]
                                }`,
                                success: `Usuario ${
                                    UserRoleRender[credentials.role]
                                } creado`,
                                error: "Error al crear el nuevo usuario, intentalo de nuevo por favor",
                            });
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
                toast.error("Por favor completa los campos con datos validos");
            }
        } else {
            setFormState({
                ...formState,
                isValid: false,
                loading: false,
            });
            toast.error("Por favor completa los campos");
        }
    };

    const getInputHandler = (
        e: React.ChangeEvent<HTMLInputElement>,
        validationFunction: InputValidator,
    ) => {
        return handleInputChangeV2(e, validationFunction, credentials, setCredentials);
    };

    useEffect(() => {
        setFormState({
            ...formState,
            isValid: thereAreNotErrorsSignUp(credentials),
        });
    }, [credentials]);

    return (
        <div className="render-data-wrapper | max-width-60">
            <h1 className="text | big bolder margin-bottom-50">
                Registrar Nuevo Usuario
            </h1>
            <SignUpFormV2
                email={{
                    value: credentials.email.value,
                    message: credentials.email.errorMessage,
                    onChange: (e) => getInputHandler(e, isValidEmail),
                }}
                password={{
                    value: credentials.password.value,
                    message: credentials.password.errorMessage,
                    onChange: (e) => getInputHandler(e, isValidPassword),
                }}
                fullName={{
                    value: credentials.fullName.value,
                    message: credentials.fullName.errorMessage,
                    onChange: (e) => getInputHandler(e, isValidName),
                }}
                phone={{
                    value: credentials.phone.value,
                    message: credentials.phone.errorMessage,
                    onChange: (str: string) =>
                        validatePhoneV2(str, credentials, setCredentials),
                }}
                location={{
                    value: credentials.location,
                    onChange: (e) =>
                        setCredentials({
                            ...credentials,
                            location: getLocation(e.target.value),
                        }),
                }}
                userRole={{
                    value: credentials.role,
                    onChange: (e) =>
                        setCredentials({
                            ...credentials,
                            role: getRole(e.target.value, rolesToRegister),
                        }),
                }}
                roles={rolesToRegister}
                image={{
                    value: credentials.photo.value,
                    message: credentials.photo.message,
                    onChange: (data: PhotoField) => {
                        setCredentials({
                            ...credentials,
                            photo: data,
                        });
                    },
                }}
                handleSummit={handleSummit}
                formState={{
                    isValid: formState.isValid,
                    loading: formState.loading,
                }}
                formInfo={{
                    message: "Registrar",
                }}
            />
        </div>
    );
};

export default UserRegistration;
