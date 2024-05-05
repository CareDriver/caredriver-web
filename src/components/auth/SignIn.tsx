"use client";

import { auth } from "@/firebase/FirebaseConfig";
import { InputValidator } from "@/utils/validator/InputValidator";
import {
    isValidEmail,
    isValidPassword,
} from "@/utils/validator/auth/CredentialsValidator";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FormData {
    email: {
        value: string;
        errorMessage: null | string;
    };
    password: {
        value: string;
        errorMessage: null | string;
    };
}

const SignIn = () => {
    const [formState, setFormState] = useState({
        loading: false,
        isValid: true,
    });
    const [credentials, setCredentials] = useState<FormData>({
        email: {
            value: "",
            errorMessage: null,
        },
        password: {
            value: "",
            errorMessage: null,
        },
    });

    const login = (e: FormEvent) => {
        e.preventDefault();
        setFormState({
            ...formState,
            loading: true,
        });
        if (
            credentials.email.value.trim().length > 0 &&
            credentials.password.value.trim().length > 0
        ) {
            if (!credentials.email.errorMessage && !credentials.password.errorMessage) {
                signInWithEmailAndPassword(
                    auth,
                    credentials.email.value,
                    credentials.password.value,
                )
                    .then((res) => {
                        setFormState({
                            ...formState,
                            loading: false,
                        });

                        window.location.replace("/redirector");
                    })
                    .catch(() => {
                        setFormState({
                            ...formState,
                            isValid: false,
                            loading: false,
                        });
                        toast.error("Algo fallo, intentalo de nuevo por favor");
                    });
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

    useEffect(() => {
        setFormState({
            ...formState,
            isValid:
                !credentials.email.errorMessage && !credentials.password.errorMessage,
        });
    }, [credentials]);

    return (
        <section className="form-container | center">
            <h1 className="text | bigger bold | margin-bottom-50">Iniciar Sesion</h1>
            <form onSubmit={login} className="form-container">
                <fieldset className="form-section">
                    <input
                        type="email"
                        name="email"
                        placeholder=""
                        value={credentials.email.value}
                        onChange={(e) => handleInputChange(e, isValidEmail)}
                        className="form-section-input"
                    />
                    <legend className="form-section-legend">Correo electrónico</legend>
                    {credentials.email.errorMessage && (
                        <small className="form-section-message">
                            {credentials.email.errorMessage}
                        </small>
                    )}
                </fieldset>
                <fieldset className="form-section">
                    <input
                        type="text"
                        name="password"
                        placeholder=""
                        value={credentials.password.value}
                        onChange={(e) => handleInputChange(e, isValidPassword)}
                        className="form-section-input"
                    />
                    <legend className="form-section-legend">Contraseña</legend>
                    {credentials.password.errorMessage && (
                        <small className="form-section-message">
                            {credentials.password.errorMessage}
                        </small>
                    )}
                </fieldset>

                <button
                    disabled={!formState.isValid}
                    className="general-button | touchable margin-top-25 touchable"
                    data-theme="dark"
                >
                    {formState.loading ? (
                        <i className="loader"></i>
                    ) : (
                        <span>Iniciar sesion</span>
                    )}
                </button>
            </form>
            <Link
                href={"/auth/signup"}
                className="text | underline medium normal | margin-top-15"
            >
                Todavia no tienes cuenta? Registrate ahora
            </Link>
        </section>
    );
};

export default SignIn;
