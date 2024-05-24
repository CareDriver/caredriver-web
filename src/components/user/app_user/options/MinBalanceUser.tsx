"use client";

import MoneyBillWave from "@/icons/MoneyBillWave";
import { Price } from "@/interfaces/Payment";
import { UserInterface } from "@/interfaces/UserInterface";
import { updateUser } from "@/utils/requests/UserRequester";
import { isValidAmount } from "@/utils/validator/debt/DebtValidator";
import { Timestamp } from "firebase/firestore";
import { SyntheticEvent, useState } from "react";
import { toast } from "react-toastify";

const MinBalanceUser = ({ user }: { user: UserInterface }) => {
    const [formState, setFormState] = useState<{
        newDebt: string;
        loading: boolean;
        message: string | null;
    }>({
        newDebt: "",
        loading: false,
        message: null,
    });

    const validToDisable = () => {
        if (user) {
            var valid = false;

            if (!user.balance) {
                valid = true;
            }
            if (user.balance && user.balance.amount <= 0) {
                valid = true;
            }

            return valid;
        }
    };

    const setMinBalance = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!formState.loading && user.id && user.balance) {
            setFormState({
                ...formState,
                loading: true,
            });
            try {
                await toast.promise(
                    updateUser(user.id, {
                        minimumBalance: {
                            amount: parseFloat(formState.newDebt),
                            currency: "Bs. (BOB)",
                        },
                    }),
                    {
                        pending: "Actualizando saldo minimo",
                        success: "Saldo minimo actualizado",
                        error: "Error al actualizar el saldo minimo, intantalo de nuevo",
                    },
                );
                window.location.reload();
                setFormState({
                    ...formState,
                    loading: false,
                });
            } catch (e) {
                setFormState({
                    ...formState,
                    loading: false,
                });
            }
        }
    };

    return (
        <section className="profile-info-wrapper | margin-top-50 max-width-60">
            <h2 className="profile-subtitle icon-wrapper | mb">
                <MoneyBillWave />
                Saldo minimo |{" "}
                {user.minimumBalance
                    ? user.minimumBalance.amount + " " + user.minimumBalance.currency
                    : "0"}
            </h2>
            <p className="text | gray-dark">
                Ingresa el nuevo saldo minimo que el usuario puede tener en su cuenta.
            </p>

            <div className="margin-top-25 margin-bottom-25">
                <fieldset className="form-section">
                    <input
                        type="text"
                        placeholder=""
                        className="form-section-input"
                        name="fullname"
                        value={formState.newDebt}
                        onChange={(e) => {
                            var newDebt = e.target.value;
                            const { isValid, message } = isValidAmount(newDebt);
                            setFormState({
                                ...formState,
                                newDebt,
                                message: isValid ? null : message,
                            });
                        }}
                    />
                    <legend className="form-section-legend">
                        Saldo minimo {user.balance.currency}
                    </legend>
                    {formState.message && <small>{formState.message}</small>}
                </fieldset>
            </div>

            <div>
                <button
                    type="button"
                    onClick={setMinBalance}
                    disabled={
                        !(formState.newDebt.trim().length > 0) ||
                        formState.message !== null
                    }
                    className="small-general-button text | medium bold touchable green"
                >
                    Establecer saldo minimo
                </button>
            </div>
        </section>
    );
};

export default MinBalanceUser;
