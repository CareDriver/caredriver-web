"use client";

import "react-international-phone/style.css";
import { auth } from "@/firebase/FirebaseConfig";
import { checkEmailExists, saveUser } from "@/utils/requests/UserRequester";
import { InputValidator } from "@/utils/validator/InputValidator";
import {
    isValidEmail,
    isValidName,
    isValidPassword,
} from "@/utils/validator/auth/CredentialsValidator";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { generateVerificationCode } from "generate-verification-code";
import SignUpForm from "./SignUpForm";
import { defaultSignUpValues, SignUpInterface } from "./AuthInterfaces";
import {
    isNotEmpty,
    thereAreNotErrorsSignUp,
} from "@/utils/validator/auth/SignUpValidator";
import {
    createUserData,
    getLocation,
    handleInputChange,
    validatePhone,
} from "@/utils/auth/UserAuth";
import AuthProviders from "./AuthProviders";

const SignUpAsNew = () => {
    const router = useRouter();
    const [formState, setFormState] = useState({
        loading: false,
        isValid: true,
        isVerifyingCode: false,
        verifiyingProvider: false,
    });
    const [credentials, setCredentials] = useState<SignUpInterface>(defaultSignUpValues);

    const signUp = async (e: FormEvent) => {
        e.preventDefault();
        setFormState({
            ...formState,
            loading: true,
        });

        if (isNotEmpty(credentials)) {
            if (thereAreNotErrorsSignUp(credentials)) {
                if (
                    credentials.code.sent.trim().length > 0 &&
                    credentials.code.sent === credentials.code.toVerify
                ) {
                    createUserWithEmailAndPassword(
                        auth,
                        credentials.email.value,
                        credentials.password.value,
                    )
                        .then((res) => {
                            const emptyUserData: UserInterface = createUserData(
                                res.user.uid,
                                UserRole.User,
                                credentials,
                            );

                            saveUser(res.user.uid, emptyUserData)
                                .then(() => {
                                    setFormState({
                                        ...formState,
                                        loading: false,
                                    });
                                    toast.success("Registro exitoso");
                                    window.location.replace("/redirector");
                                })
                                .catch(() => {
                                    setFormState({
                                        ...formState,
                                        loading: false,
                                    });
                                });
                        })
                        .catch((error) => {
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            if (errorCode === "auth/email-already-in-use") {
                                toast.error("El correo electrónico ya está en uso");
                                setCredentials({
                                    ...credentials,
                                    email: {
                                        ...credentials.email,
                                        errorMessage:
                                            "El correo electrónico ya está en uso",
                                    },
                                });
                                setFormState({
                                    ...formState,
                                    isValid: false,
                                    loading: false,
                                    isVerifyingCode: false,
                                });
                            } else {
                                toast.error("Algo fallo, intentalo de nuevo por favor");
                                console.log(errorMessage);
                                setFormState({
                                    ...formState,
                                    isValid: false,
                                    loading: false,
                                    isVerifyingCode: false,
                                });
                            }
                        });
                } else {
                    setFormState({
                        ...formState,
                        isValid: false,
                        loading: false,
                    });
                    setCredentials({
                        ...credentials,
                        code: {
                            ...credentials.code,
                            errorMessage: "Codigo invalido, vuelve a intentarlo",
                        },
                    });
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

    useEffect(() => {
        setFormState({
            ...formState,
            isValid: thereAreNotErrorsSignUp(credentials),
        });
    }, [credentials]);

    const verifyCode = async (e: FormEvent) => {
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
                            isVerifyingCode: false,
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
                        var codeToSent: string =
                            "" +
                            generateVerificationCode({
                                length: 6,
                                type: "string",
                            });
                        try {
                            /* 
                            Cross-Origin Request Warning: The Same Origin 
                            Policy will disallow reading the remote resource 
                            at https://gate.whapi.cloud/messages/text soon. 
                            (Reason: When the `Access-Control-Allow-Headers` is `*`, 
                            the `Authorization` header is not covered. To include the 
                            `Authorization` header, it must be explicitly listed 
                            in CORS header `Access-Control-Allow-Headers`).
                            */

                            await toast.promise(
                                fetch("/api/sms", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        phone: credentials.phone.value,
                                        code: codeToSent,
                                    }),
                                }),
                                {
                                    pending:
                                        "Enviando codigo de verificacion a tu celular",
                                    success: "Codigo enviado",
                                    error: "Error al enviar el codigo, intentalo de nuevo por favor",
                                },
                            );

                            setCredentials({
                                ...credentials,
                                code: {
                                    ...credentials.code,
                                    sent: codeToSent,
                                },
                            });

                            setFormState({
                                ...formState,
                                isVerifyingCode: true,
                                loading: false,
                            });
                        } catch (e) {
                            setFormState({
                                ...formState,
                                isValid: false,
                                isVerifyingCode: false,
                                loading: false,
                            });
                        }
                    }
                } catch (e) {
                    setFormState({
                        ...formState,
                        isValid: false,
                        isVerifyingCode: false,
                        loading: false,
                    });
                    toast.error("Ocurrio un error, intentalo de nuevo por favor");
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
        return handleInputChange(e, validationFunction, credentials, setCredentials);
    };

    return (
        <div
            className="form-container form-auth margin-top-50"
            data-state={
                formState.verifiyingProvider || formState.loading ? "loading" : ""
            }
        >
            <AuthProviders
                router={router}
                setVerifier={(s: boolean) =>
                    setFormState({
                        ...formState,
                        verifiyingProvider: s,
                    })
                }
                verifiyingProvider={formState.verifiyingProvider}
            />

            {formState.isVerifyingCode ? (
                <form onSubmit={signUp} className="form-container | full-form">
                    <fieldset className="form-section">
                        <input
                            type="text"
                            placeholder=""
                            value={credentials.code.toVerify}
                            onChange={(e) =>
                                setCredentials({
                                    ...credentials,
                                    code: {
                                        ...credentials.code,
                                        toVerify: e.target.value,
                                    },
                                })
                            }
                            className="form-section-input"
                        />
                        <legend className="form-section-legend">
                            Codigo de verificacion
                        </legend>
                        {credentials.code.errorMessage && (
                            <small>{credentials.code.errorMessage}</small>
                        )}
                    </fieldset>
                    <button className="general-button | touchable margin-top-25">
                        {formState.loading ? (
                            <i className="loader"></i>
                        ) : (
                            <span>Verificar codigo</span>
                        )}
                    </button>
                </form>
            ) : (
                <SignUpForm
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
                            validatePhone(str, credentials, setCredentials),
                    }}
                    location={{
                        value: credentials.location,
                        onChange: (e) =>
                            setCredentials({
                                ...credentials,
                                location: getLocation(e.target.value),
                            }),
                    }}
                    handleSummit={verifyCode}
                    formState={{
                        isValid: formState.isValid,
                        loading: formState.loading,
                    }}
                    formInfo={{
                        message: "Verificar numero",
                    }}
                />
            )}
        </div>
    );
};

export default SignUpAsNew;
