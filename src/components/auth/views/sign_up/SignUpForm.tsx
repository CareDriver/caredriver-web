"use client";

import "react-international-phone/style.css";
import { auth } from "@/firebase/FirebaseConfig";
import {
    checkEmailExists,
    saveUser,
} from "@/components/app_modules/users/api/UserRequester";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FormEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserInterface } from "@/interfaces/UserInterface";
import { generateVerificationCode } from "generate-verification-code";
import EmailField from "@/components/form/view/fields/EmailField";
import PasswordField from "@/components/form/view/fields/PasswordField";
import TextField from "@/components/form/view/fields/TextField";
import PhoneField from "@/components/form/view/fields/PhoneField";
import LocationField from "@/components/form/view/fields/LocationField";
import Link from "next/link";
import { AuthenticatorContext } from "../../contexts/AuthenticatorContext";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import NumberField from "@/components/form/view/fields/NumberField";
import { validateCodeOfVerification } from "../../validators/CodeValidator";
import {
    VerificationCodeField,
    TextField as TextFieldForm,
} from "@/components/form/models/FormFields";
import { Locations } from "@/interfaces/Locations";
import {
    DEFAUL_TEXT_FIELD,
    DEFAUL_VERIFICATION_CODE_FIELD,
} from "@/components/form/models/DefaultFields";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { isValidName } from "@/components/app_modules/users/validators/for_data/CredentialsValidator";
import { EMPTY_USER_DATA } from "../../api/UserAuth";
import { routeToSingIn } from "@/utils/route_builders/as_not_logged/RouteBuilderForAuth";

interface Form {
    fullName: TextFieldForm;
    phone: TextFieldForm;
    email: TextFieldForm;
    password: TextFieldForm;
    location: Locations;
    code: VerificationCodeField;
}

enum View {
    FILLING_OUT_FORM,
    VERIFYING_CODE,
}

const SignUpForm = () => {
    const [view, setView] = useState(View.FILLING_OUT_FORM);
    const { loading, isValid, setLoading, setValid } =
        useContext(AuthenticatorContext);

    const [form, setForm] = useState<Form>(DEFAULT_FORM);

    const signUp = async (e: FormEvent) => {
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
                let newUser: UserInterface = formToNewUser(form);
                newUser.id = res.user.uid;

                saveUser(res.user.uid, newUser)
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

        if (!isValidForm(form)) {
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
        setValid(isValidForm(form));
    }, [form]);

    if (view === View.VERIFYING_CODE) {
        return (
            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: "Continuar",
                        },
                        behavior: {
                            isValid: isValid,
                            loading: loading,
                        },
                    },
                }}
                behavior={{
                    loading: loading,
                    onSummit: signUp,
                }}
            >
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
            </BaseForm>
        );
    }

    return (
        <>
            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: "Verificar datos",
                        },
                        behavior: {
                            isValid: isValid,
                            loading: loading,
                        },
                    },
                }}
                behavior={{
                    loading: loading,
                    onSummit: sentCode,
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
            </BaseForm>

            <Link href={routeToSingIn()} className="text | small center underline">
                ¿Ya tienes cuenta? Inicia sesión
            </Link>
        </>
    );
};

export default SignUpForm;

const DEFAULT_FORM: Form = {
    fullName: DEFAUL_TEXT_FIELD,
    phone: DEFAUL_TEXT_FIELD,
    email: DEFAUL_TEXT_FIELD,
    password: DEFAUL_TEXT_FIELD,
    code: DEFAUL_VERIFICATION_CODE_FIELD,
    location: Locations.CochabambaBolivia,
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
    return {
        ...EMPTY_USER_DATA,
        fullName: form.fullName.value,
        phoneNumber: form.phone.value,
        location: form.location,
        email: form.email.value.toLowerCase().trim(),
    };
}
