"use client";

import "react-international-phone/style.css";
import { auth } from "@/firebase/FirebaseConfig";
import { servicesData } from "@/interfaces/ServicesDataInterface";
import { saveUser } from "@/utils/requests/UserRequester";
import { InputValidator } from "@/utils/validator/InputValidator";
import {
    isPhoneValid,
    isValidEmail,
    isValidName,
    isValidPassword,
} from "@/utils/validator/auth/CredentialsValidator";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { locationList, Locations } from "@/interfaces/Locations";
import PhoneForm from "../form/PhoneForm";
import { defaultServiceReq, UserInterface, UserRole } from "@/interfaces/UserInterface";
import { Services } from "@/interfaces/Services";
import { generateVerificationCode } from "generate-verification-code";

interface FormData {
    fullName: {
        value: string;
        errorMessage: null | string;
    };
    phone: {
        value: string;
        errorMessage: null | string;
    };
    email: {
        value: string;
        errorMessage: null | string;
    };
    password: {
        value: string;
        errorMessage: null | string;
    };
    code: {
        sent: string;
        toVerify: string;
        errorMessage: null | string;
    };
    location: Locations;
}

const SignUpAsNew = () => {
    const router = useRouter();
    const [formState, setFormState] = useState({
        loading: false,
        isValid: true,
        isVerifyingCode: false,
    });
    const [credentials, setCredentials] = useState<FormData>({
        fullName: {
            value: "",
            errorMessage: null,
        },
        phone: {
            value: "",
            errorMessage: null,
        },
        email: {
            value: "",
            errorMessage: null,
        },
        password: {
            value: "",
            errorMessage: null,
        },
        code: {
            sent: "",
            toVerify: "",
            errorMessage: null,
        },
        location: Locations.CochabambaBolivia,
    });

    const signUp = async (e: FormEvent) => {
        e.preventDefault();
        setFormState({
            ...formState,
            loading: true,
        });

        if (
            credentials.email.value.trim().length > 0 &&
            credentials.password.value.trim().length > 0 &&
            credentials.phone.value.trim().length > 0 &&
            credentials.fullName.value.trim().length > 0
        ) {
            if (
                !credentials.fullName.errorMessage &&
                !credentials.phone.errorMessage &&
                !credentials.email.errorMessage &&
                !credentials.password.errorMessage
            ) {
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
                            const emptyUserData: UserInterface = {
                                id: res.user.uid,
                                role: UserRole.User,
                                fullName: credentials.fullName.value,
                                phoneNumber: credentials.phone.value,
                                photoUrl: "",

                                comments: [],
                                vehicles: [],
                                services: [Services.Normal],

                                servicesData: servicesData,
                                pickUpLocationsHistory: [],
                                deliveryLocationsHistory: [],

                                location: credentials.location,
                                email: credentials.email.value.toLowerCase(),

                                serviceRequests: defaultServiceReq,
                            };

                            saveUser(res.user.uid, emptyUserData)
                                .then(() => {
                                    setFormState({
                                        ...formState,
                                        loading: false,
                                    });
                                    toast.success("Registro exitoso");
                                    router.push("/services/drive");
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

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        validationFunction: InputValidator,
    ) => {
        const value = e.target.value;
        const { isValid, message } = validationFunction(value);

        setCredentials({
            ...credentials,
            [e.target.name]: {
                value: value,
                errorMessage: isValid ? "" : message,
            },
        });
    };

    const validatePhone = (phone: string) => {
        const { isValid, message } = isPhoneValid(phone);

        setCredentials({
            ...credentials,
            phone: {
                ...credentials.phone,
                value: phone,
                errorMessage: isValid ? "" : message,
            },
        });
    };

    const getLocation = (input: string): Locations => {
        var location = Locations.CochabambaBolivia;
        locationList.forEach((value) => {
            if (value === input) {
                location = value;
            }
        });

        return location;
    };

    useEffect(() => {
        setFormState({
            ...formState,
            isValid:
                !credentials.fullName.errorMessage &&
                !credentials.phone.errorMessage &&
                !credentials.email.errorMessage &&
                !credentials.password.errorMessage,
        });
    }, [credentials]);

    const verifyCode = async (e: FormEvent) => {
        e.preventDefault();
        setFormState({
            ...formState,
            loading: true,
        });

        if (
            credentials.email.value.trim().length > 0 &&
            credentials.password.value.trim().length > 0 &&
            credentials.phone.value.trim().length > 0 &&
            credentials.fullName.value.trim().length > 0
        ) {
            if (
                !credentials.fullName.errorMessage &&
                !credentials.phone.errorMessage &&
                !credentials.email.errorMessage &&
                !credentials.password.errorMessage
            ) {
                try {
                    var codeToSent: string =
                        "" +
                        generateVerificationCode({
                            length: 6,
                            type: "string",
                        });
                    try {
                        await toast.promise(
                            fetch("/api/sms", {
                                method: "POST",
                                body: JSON.stringify({
                                    code: codeToSent,
                                    toPhone: credentials.phone.value,
                                }),
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                },
                            }),
                            {
                                pending: "Enviando codigo de verificacion a tu celular",
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
                } catch (e) {
                    setFormState({
                        ...formState,
                        isValid: false,
                        isVerifyingCode: false,
                        loading: false,
                    });
                    toast.error(
                        "Error al enviar el codigo, intentalo de nuevo por favor",
                    );
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

    return (
        <div className="form-container margin-top-50">
            {formState.isVerifyingCode ? (
                <form onSubmit={signUp} className="form-container">
                    <fieldset className="form-section">
                        <input
                            type="text"
                            placeholder="000000"
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
                <form onSubmit={verifyCode} className="form-container">
                    <fieldset className="form-section">
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo Electronico"
                            value={credentials.email.value}
                            onChange={(e) => handleInputChange(e, isValidEmail)}
                            className="form-section-input"
                        />
                        {credentials.email.errorMessage && (
                            <small>{credentials.email.errorMessage}</small>
                        )}
                    </fieldset>
                    <fieldset className="form-section">
                        <input
                            type="text"
                            name="password"
                            placeholder="Contraseña"
                            value={credentials.password.value}
                            onChange={(e) => handleInputChange(e, isValidPassword)}
                            className="form-section-input"
                        />
                        {credentials.password.errorMessage && (
                            <small>{credentials.password.errorMessage}</small>
                        )}
                    </fieldset>
                    <fieldset className="form-section">
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Nombre Completo"
                            value={credentials.fullName.value}
                            onChange={(e) => handleInputChange(e, isValidName)}
                            className="form-section-input"
                        />
                        {credentials.fullName.errorMessage && (
                            <small>{credentials.fullName.errorMessage}</small>
                        )}
                    </fieldset>
                    <fieldset className="form-section">
                        <PhoneForm
                            phone={credentials.phone.value}
                            validatePhone={validatePhone}
                        />
                        {credentials.phone.errorMessage && (
                            <small>{credentials.phone.errorMessage}</small>
                        )}
                    </fieldset>
                    <fieldset className="form-section">
                        <select
                            className="form-section-input"
                            onChange={(e) => {
                                setCredentials({
                                    ...credentials,
                                    location: getLocation(e.target.value),
                                });
                            }}
                            value={credentials.location}
                        >
                            {locationList.map((location, i) => (
                                <option key={`location-option-${i}`} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </fieldset>

                    <button
                        className="general-button | touchable margin-top-25 touchable"
                        data-theme="dark"
                        disabled={!formState.isValid}
                    >
                        {formState.loading ? (
                            <i className="loader"></i>
                        ) : (
                            <span>Verificar numero</span>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
};

export default SignUpAsNew;
