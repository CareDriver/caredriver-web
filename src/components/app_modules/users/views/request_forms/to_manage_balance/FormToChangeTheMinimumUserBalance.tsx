"use client";

import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import TextField from "@/components/form/view/fields/TextField";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { PageStateContext } from "@/context/PageStateContext";
import MoneyBillWave from "@/icons/MoneyBillWave";
import { UserInterface } from "@/interfaces/UserInterface";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import { isValidAmount } from "@/components/app_modules/users/validators/for_data/BalanceValidator";
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const FormToChangeTheMinimumUserBalance = ({ user }: { user: UserInterface }) => {
    const { loading, setLoading, setLoadingAll } = useContext(PageStateContext);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [minBalance, setMinBalance] = useState<TextFieldForm>(DEFAUL_TEXT_FIELD);

    const perform = async () => {
        if (user.id && user.balance) {
            try {
                await toast.promise(
                    updateUser(user.id, {
                        minimumBalance: {
                            amount: parseFloat(minBalance.value),
                            currency: "Bs. (BOB)",
                        },
                    }),
                    {
                        pending: "Actualizando saldo mínimo",
                        success: "Saldo mínimo actualizado",
                        error: "Error al actualizar el saldo mínimo, inténtalo de nuevo",
                    },
                );
                window.location.reload();
                setLoading(false);
            } catch (e) {
                setLoading(false);
            }
        }
    };

    const onSummit = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!loading && !formState.loading) {
            setLoadingAll(true, setFormState);
            await perform();
            setLoadingAll(false, setFormState);
        }
    };

    useEffect(() => {
        setFormState((prev) => ({
            ...prev,
            isValid: isValidTextField(minBalance),
        }));
    }, []);

    return (
        <section className="profile-info-wrapper | margin-top-50 max-width-60">
            <h2 className="profile-subtitle icon-wrapper | mb">
                <MoneyBillWave />
                Saldo mínimo |{" "}
                {user.minimumBalance
                    ? user.minimumBalance.amount +
                      " " +
                      user.minimumBalance.currency
                    : "0"}
            </h2>
            <p className="text | gray-dark">
                Ingresa el nuevo saldo mínimo que el usuario puede tener en su
                cuenta.
            </p>

            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: "Cambiar saldo mínimo",
                        },
                        behavior: {
                            loading: formState.loading,
                            isValid: formState.isValid,
                        },
                    },
                }}
                behavior={{
                    loading: formState.loading || loading,
                    onSummit: onSummit,
                }}
            >
                <TextField
                    field={{
                        values: minBalance,
                        setter: setMinBalance,
                        validator: isValidAmount,
                    }}
                    legend={`Saldo mínimo ${user.balance.currency}`}
                />
            </BaseForm>
        </section>
    );
};

export default FormToChangeTheMinimumUserBalance;
