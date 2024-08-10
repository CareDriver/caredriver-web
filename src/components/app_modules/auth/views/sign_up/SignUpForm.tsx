"use client";

import "react-international-phone/style.css";
import { auth } from "@/firebase/FirebaseConfig";
import { checkEmailExists, saveUser } from "@/utils/requests/UserRequester";
import { isValidName } from "@/utils/validator/auth/CredentialsValidator";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FormEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { generateVerificationCode } from "generate-verification-code";
import { createUserData } from "@/utils/auth/UserAuth";
import { SignUp } from "../../models/SignUpSignatures";
import { DEFAULT_SIGN_UP } from "../../models/DefaultSignUp";
import EmailField from "@/components/form/view/fields/EmailField";
import PasswordField from "@/components/form/view/fields/PasswordField";
import TextField from "@/components/form/view/fields/TextField";
import PhoneField from "@/components/form/view/fields/PhoneField";
import LocationField from "@/components/form/view/fields/LocationField";
import Link from "next/link";
import { AuthenticatorContext } from "../../contexts/AuthenticationContext";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import { genFakeId } from "@/utils/IdGenerator";
import NumberField from "@/components/form/view/fields/NumberField";
import { validateCodeOfVerification } from "../../validators/CodeValidator";

enum View {
    FILLING_OUT_FORM,
    VERIFYING_CODE,
}

const SignUpForm = () => {
    const [view, setView] = useState(View.FILLING_OUT_FORM);
    const { loading, isValid, setLoading, setValid } =
        useContext(AuthenticatorContext);

    const [form, setForm] = useState<SignUp>(DEFAULT_SIGN_UP);

    const isValidForm = (): boolean => {
        return (
            isValidTextField(form.email) &&
            isValidTextField(form.password) &&
            isValidTextField(form.fullName) &&
            isValidTextField(form.phone)
        );
    };

    const signUp = async (e: FormEvent) => {
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

        if (form.code.codeSent !== form.code.currentCode) {
            setLoading(false);
            setValid(false);
            setForm((prev) => ({
                ...prev,
                code: {
                    ...form.code,
                    message: "Código invalido, vuelve a intentarlo",
                },
            }));
            return;
        }

        createUserWithEmailAndPassword(
            auth,
            form.email.value.toLocaleLowerCase().trim(),
            form.password.value.trim(),
        )
            .then((res) => {
                const fakeId = genFakeId();
                let emptyUserData: UserInterface = createUserData(
                    res.user.uid,
                    fakeId,
                    UserRole.User,
                    form,
                );

                saveUser(res.user.uid, emptyUserData)
                    .then(() => {
                        toast.success("Registro exitoso");
                        window.location.replace("/redirector");
                    })
                    .catch(() => {
                        setLoading(false);
                        toast.error(
                            "Error al guardar los datos, intentalo de nuevo por favor",
                        );
                    });
            })
            .catch((e) => {
                let errorCode = e.code;
                if (errorCode === "auth/email-already-in-use") {
                    toast.error("El correo electrónico ya está en uso");
                    setForm({
                        ...form,
                        email: {
                            ...form.email,
                            message: "El correo electrónico ya está en uso",
                        },
                    });
                    setLoading(false);
                    setValid(false);
                } else {
                    toast.error("Algo fallo, inténtalo de nuevo por favor");
                    setLoading(false);
                    setValid(false);
                }
            });
    };

    const sentCode = async (e: FormEvent) => {
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

        try {
            let amountOfUsers = await checkEmailExists(form.email.value);
            if (amountOfUsers > 0) {
                setForm((prev) => ({
                    ...prev,
                    email: {
                        ...prev.email,
                        message: "El correo ya fue registrado",
                    },
                }));
                setLoading(false);
                setValid(false);
                toast.error("El correo ya fue registrado, inicia sesión");
                return;
            }

            let codeSent: string = String(
                generateVerificationCode({
                    length: 6,
                    type: "string",
                }),
            );
            try {
                await toast.promise(
                    fetch("/api/sms", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            phone: form.phone.value,
                            code: codeSent,
                        }),
                    }),
                    {
                        pending: "Enviando código de verificación a tu celular",
                        success: "Código enviado",
                        error: "Error al enviar el código, inténtalo de nuevo por favor",
                    },
                );

                setForm((prev) => ({
                    ...prev,
                    code: {
                        ...prev.code,
                        codeSent: codeSent,
                    },
                }));

                setLoading(false);
                setView(View.VERIFYING_CODE);
            } catch (e) {
                setLoading(false);
                setValid(false);
                toast.error("Ocurrio un error, inténtalo de nuevo por favor");
            }
        } catch (e) {
            setLoading(false);
            setValid(false);
            toast.error("Ocurrio un error, inténtalo de nuevo por favor");
        }
    };

    useEffect(() => {
        setValid(isValidForm());
    }, [form]);

    if (view === View.VERIFYING_CODE) {
        return (
            <form onSubmit={signUp} className="form-container | full-form">
                <NumberField
                    legend="Código de verificación"
                    field={{
                        values: {
                            value: form.code.currentCode,
                            message: form.code.message,
                        },
                        setter: (e) =>
                            setForm({
                                ...form,
                                code: {
                                    ...form.code,
                                    currentCode: e.value,
                                    message: e.message,
                                },
                            }),
                        validator: validateCodeOfVerification,
                    }}
                />
                <button className="general-button | touchable margin-top-25">
                    {loading ? (
                        <i className="loader"></i>
                    ) : (
                        <span>Verificar código</span>
                    )}
                </button>
            </form>
        );
    }

    return (
        <>
            <form onSubmit={sentCode} className="form-container | full-form">
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
                            setForm((prev) => ({
                                ...prev,
                                fullName: e,
                            })),
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
                <button
                    className="general-button | touchable margin-top-25 touchable"
                    data-theme="dark"
                    disabled={!isValid}
                >
                    {loading ? (
                        <i className="loader"></i>
                    ) : (
                        <span>Verificar número</span>
                    )}
                </button>
            </form>
            <Link href={"/auth/signin"} className="text | small underline">
                ¿Ya tienes cuenta? Inicia sesión
            </Link>
        </>
    );
};

export default SignUpForm;
