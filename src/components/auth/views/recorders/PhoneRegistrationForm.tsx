"use client";

import { FormEvent, useContext, useEffect, useState } from "react";
import { AuthenticatorContext } from "../../contexts/AuthenticatorContext";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import { AuthContext } from "@/context/AuthContext";
import PageLoading from "@/components/loaders/PageLoading";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import { toast } from "react-toastify";
import { sendVerificationCode } from "../../api/VerificationCodeSender";
import PhoneField from "@/components/form/view/fields/PhoneField";
import CodeVerifier from "../verifiers/CodeVerifier";
import { useRouter } from "next/navigation";
import { routeToProfileAsUser } from "@/utils/route_builders/as_user/RouteBuilderForProfileAsUser";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import "react-international-phone/style.css";

interface Form {
    phone: TextFieldForm;
    code: string;
}

enum View {
    FILLING_OUT_FORM,
    VERIFYING_CODE,
}

const PhoneRegistrationForm = () => {
    const [view, setView] = useState(View.FILLING_OUT_FORM);
    const [form, setForm] = useState<Form>(DEFAULT_FORM);
    const router = useRouter();
    const { checkingUserAuth, user, userProps } = useContext(AuthContext);
    const { loading, isValid, setLoading, setValid } =
        useContext(AuthenticatorContext);

    const addPhone = async () => {
        if (!isValidTextField(form.phone)) {
            setLoading(false);
            setValid(false);
            toast.error("Formulario invalido");
            return;
        }

        if (!user || !user.id) {
            setLoading(false);
            setValid(false);
            toast.warning(
                "No se encontraron datos necesarios para agregar tu numero de telefono",
            );
            return;
        }

        try {
            await toast.promise(
                updateUser(user.id, {
                    phoneNumber: form.phone.value,
                }),
                {
                    pending: "Agregando numero de celular",
                    success: "Numero de celular agregado",
                    error: "Error al agregar numero de celular, intentalo de nuevo por favor",
                },
            );
            window.location.replace(routeToProfileAsUser());
        } catch (e) {
            setLoading(false);
            setValid(false);
            toast.error("Ocurrio un error, inténtalo de nuevo por favor");
        }
    };

    const sentCode = async (e: FormEvent) => {
        e.preventDefault();
        if (loading) {
            return;
        }

        setLoading(true);

        if (!isValidTextField(form.phone)) {
            setLoading(false);
            setValid(false);
            toast.error("Formulario invalido");
            return;
        }

        try {
            let codeSent: string = await sendVerificationCode(form.phone.value);
            setForm((prev) => ({
                ...prev,
                code: codeSent,
            }));

            setLoading(false);
            setView(View.VERIFYING_CODE);
        } catch (e) {
            setLoading(false);
            setValid(false);
            toast.error("Ocurrio un error, inténtalo de nuevo por favor");
        }
    };

    useEffect(() => {
        if (!checkingUserAuth && user) {
            if (userProps.hasPhone) {
                router.push(routeToProfileAsUser());
                toast.warning("Ya registraste tu numero de celular", {
                    toastId: "phone-already-registered",
                });
            }
        }
    }, [checkingUserAuth]);

    if (checkingUserAuth || !user) {
        return <PageLoading />;
    }

    return (
        <div className="service-form-wrapper | max-height-100">
            <h3 className="text | big bold">
                Agrega tu <i className="text | big bolder">numero de celular</i>
            </h3>
            <p className="text | light">
                Nuestros administradores podran contactarte de manera mas rapida
                si agregas tu numero de celular.
            </p>

            {view === View.FILLING_OUT_FORM && (
                <BaseForm
                    content={{
                        button: {
                            content: {
                                legend: "Enviar codigo de verificacion",
                            },
                            behavior: {
                                isValid: isValid,
                                loading: loading,
                            },
                        },
                        styleClasses: "max-width-60",
                    }}
                    behavior={{
                        loading: loading,
                        onSummit: sentCode,
                    }}
                >
                    <PhoneField
                        values={form.phone}
                        setter={(e) =>
                            setForm((prev) => ({ ...prev, phone: e }))
                        }
                    />
                </BaseForm>
            )}
            {view === View.VERIFYING_CODE && (
                <div className="max-width-60">
                    <CodeVerifier
                        onSummbit={addPhone}
                        verificationCode={form.code}
                    />
                </div>
            )}

            <span className="circles-right-bottomv2 green"></span>
        </div>
    );
};

export default PhoneRegistrationForm;

const DEFAULT_FORM: Form = {
    phone: DEFAUL_TEXT_FIELD,
    code: "",
};
