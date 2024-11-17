"use client";

import { auth } from "@/firebase/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { FormEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import EmailField from "@/components/form/view/fields/EmailField";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import PasswordField from "@/components/form/view/fields/PasswordField";
import { AuthenticatorContext } from "../../contexts/AuthenticatorContext";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { routeToSingUp } from "@/utils/route_builders/as_not_logged/RouteBuilderForAuth";
import AuthProviders from "../providers/AuthProviders";

interface Form {
    email: TextFieldForm;
    password: TextFieldForm;
}

const SignInForm = () => {
    const { loading, isValid, setLoading, setValid } =
        useContext(AuthenticatorContext);
    const [form, setForm] = useState<Form>(DEFAULT_FORM);

    const login = async () => {
        signInWithEmailAndPassword(
            auth,
            form.email.value.toLocaleLowerCase().trim(),
            form.password.value.trim(),
        )
            .then((res) => {
                window.location.replace("/redirector");
            })
            .catch((e) => {
                let message: string = e.message;
                if (message.includes("user-disabled")) {
                    toast.warning(
                        "Tu cuenta fue deshabilitada, por favor contacta a uno de nuestros administradores",
                    );
                } else {
                    toast.error("Credenciales inválidas, inténtalo de nuevo");
                }

                setLoading(false);
                setValid(false);
            });
    };

    const summitForm = async (e: FormEvent) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        setLoading(true);

        if (!isValidForm(form)) {
            setLoading(false);
            setValid(false);
            toast.error("Formulario invalido");
            return;
        }

        await login();
    };

    useEffect(() => {
        setValid(isValidForm(form));
    }, [form]);

    return (
        <>
            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: "Iniciar sesión",
                        },
                        behavior: {
                            isValid: isValid,
                            loading: loading,
                        },
                    
                    }
                }}
                behavior={{
                    loading: loading,
                    onSummit: summitForm,
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
            </BaseForm>
            <AuthProviders alternativeLegend="O inicia sesion con"/>
            <Link
                href={routeToSingUp()}
                className="text | normal center"
            >
                ¿Aun no tienes una cuenta? <b>Crea una cuenta</b>
            </Link>
        </>
    );
};

export default SignInForm;

const DEFAULT_FORM: Form = {
    email: DEFAUL_TEXT_FIELD,
    password: DEFAUL_TEXT_FIELD,
};

function isValidForm(form: Form): boolean {
    return isValidTextField(form.email) && isValidTextField(form.password);
}
