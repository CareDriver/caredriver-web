"use client";

import NumberField from "@/components/form/view/fields/NumberField";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { FormEvent, useContext, useEffect, useState } from "react";
import { AuthenticatorContext } from "../../contexts/AuthenticatorContext";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import { validateCodeOfVerification } from "../../validators/CodeValidator";
import { isValidTextField } from "@/components/form/validators/FieldValidators";

interface Props {
    verificationCode: string;
    onSummbit: () => Promise<void>;
}

const CodeVerifier: React.FC<Props> = ({ verificationCode, onSummbit }) => {
    const [code, setCode] = useState<TextFieldForm>(DEFAUL_TEXT_FIELD);
    const { loading, isValid, setLoading, setValid } =
        useContext(AuthenticatorContext);

    const handleSummbit = async (e: FormEvent) => {
        e.preventDefault()
        if (loading) {
            return;
        }

        setLoading(true);

        if (!isValidTextField(code)) {
            setLoading(false);
            setCode((prev) => ({
                ...prev,
                message: "Ingresa el codigo de verificaion",
            }));
            return;
        }

        if (code.value !== verificationCode) {
            setLoading(false);
            setCode((prev) => ({
                ...prev,
                message: "Código invalido, vuelve a intentarlo",
            }));
            return;
        }

        await onSummbit();
    };

    useEffect(() => {
        setValid(isValidTextField(code));
    }, [code]);

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
                onSummit: handleSummbit,
            }}
        >
            <NumberField
                legend="Código de verificación"
                field={{
                    values: code,
                    setter: setCode,
                    validator: validateCodeOfVerification,
                }}
            />
        </BaseForm>
    );
};

export default CodeVerifier;
