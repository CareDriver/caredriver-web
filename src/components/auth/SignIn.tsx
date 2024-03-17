"use client";

import { auth } from "@/firebase/FirebaseConfig";
import {
    InputValidator,
    isValidEmail,
    isValidPassword,
} from "@/utils/validator/CredentialsValidator";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const SignIn = () => {
    const [formState, setFormState] = useState({
        loading: false,
        errorMessage: "",
    });
    const [credentials, setCredentials] = useState({
        email: {
            value: "",
            errorMessage: "",
        },
        password: {
            value: "",
            errorMessage: "",
        },
    });
    const router = useRouter();

    const login = (e: FormEvent) => {
        e.preventDefault();
        setFormState({
            ...formState,
            loading: true,
        });
        signInWithEmailAndPassword(
            auth,
            credentials.email.value,
            credentials.password.value,
        )
            .then(() => {
                setFormState({
                    ...formState,
                    loading: false,
                });
                router.push("/services/drive");
                toast("Inicio de sesion exitoso");
            })
            .catch(() => {
                setFormState({
                    loading: false,
                    errorMessage: "Correo o contraseña incorrecta.",
                });
            });
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

    return (
        <section>
            <h1>Iniciar Sesion</h1>
            <form onSubmit={login}>
                <fieldset>
                    <input
                        type="email"
                        placeholder="Correo Electronico"
                        name="email"
                        value={credentials.email.value}
                        onChange={(e) => handleInputChange(e, isValidEmail)}
                    />
                    {credentials.email.errorMessage.length > 0 && (
                        <small>{credentials.email.errorMessage}</small>
                    )}
                </fieldset>
                <fieldset>
                    <input
                        type="text"
                        placeholder="Contraseña"
                        name="password"
                        value={credentials.password.value}
                        onChange={(e) => handleInputChange(e, isValidPassword)}
                    />
                    {credentials.password.errorMessage.length > 0 && (
                        <small>{credentials.password.errorMessage}</small>
                    )}
                </fieldset>

                {formState.errorMessage.length > 0 && (
                    <span>{formState.errorMessage}</span>
                )}

                <button
                    disabled={
                        credentials.email.errorMessage !== "" ||
                        credentials.password.errorMessage !== ""
                    }
                >
                    {formState.loading && <i className="loader"></i>}
                    <span>Iniciar sesion</span>
                </button>
            </form>
            <Link href={"/auth/signup"}>Todavia no tienes cuenta? Registrate ahora</Link>
        </section>
    );
};

export default SignIn;
