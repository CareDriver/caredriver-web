"use client";

import { auth } from "@/firebase/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { FormEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SignIn } from "../../models/SignInSignatures";
import EmailField from "@/components/form/view/fields/EmailField";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import PasswordField from "@/components/form/view/fields/PasswordField";
import { AuthenticatorContext } from "../../contexts/AuthenticationContext";
import { isValidTextField } from "@/components/form/validators/FieldValidators";

const SignInForm = () => {
    const { loading, isValid, setLoading, setValid } =
        useContext(AuthenticatorContext);
    const [form, setForm] = useState<SignIn>({
        email: DEFAUL_TEXT_FIELD,
        password: DEFAUL_TEXT_FIELD,
    });

    const isValidForm = (): boolean => {
        return isValidTextField(form.email) && isValidTextField(form.password);
    };

    const login = () => {
        signInWithEmailAndPassword(
            auth,
            form.email.value.toLocaleLowerCase().trim(),
            form.password.value.trim(),
        )
            .then((res) => {
                setLoading(false);
                window.location.replace("/redirector");
            })
            .catch((e) => {
                let message: string = e.message;
                if (message.includes("user-disabled")) {
                    toast.warning(
                        "Tu cuenta fue desabilitada, por favor contactate con uno de nuestros administradores",
                    );
                } else {
                    toast.error("Credenciales inválidas, intalo de nuevo");
                }

                setLoading(false);
                setValid(false);
            });
    };

    const summitForm = (e: FormEvent) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        setLoading(true);

        if (!isValidForm()) {
            setLoading(false);
            setValid(false);
            toast.error("Formulario invalido");
            return;
        }

        login();
    };

    useEffect(() => {
        setValid(isValidForm());
    }, [form]);

    return (
        <>
            <form onSubmit={summitForm} className="form-container | full-form">
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
                <button
                    disabled={!isValid}
                    className="general-button | touchable margin-top-25 touchable"
                    data-theme="dark"
                >
                    {loading ? (
                        <i className="loader"></i>
                    ) : (
                        <span>Iniciar sesión</span>
                    )}
                </button>
            </form>
            <Link
                href={"/auth/signup"}
                className="text | underline medium normal | margin-top-15"
            >
                ¿Todavía no tienes cuenta? Regístrate ahora
            </Link>
        </>
    );
};

export default SignInForm;
