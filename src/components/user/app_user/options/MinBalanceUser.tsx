"use client";

import MoneyBillWave from "@/icons/MoneyBillWave";
import { Price } from "@/interfaces/Payment";
import { UserInterface } from "@/interfaces/UserInterface";
import { updateUser } from "@/utils/requests/UserRequester";
import { isValidAmount } from "@/utils/validator/debt/DebtValidator";
import { Timestamp } from "firebase/firestore";
import { SyntheticEvent, useState } from "react";
import { toast } from "react-toastify";

const MinBalanceUser = ({
    user,
    loading,
    setLoading,
}: {
    user: UserInterface;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}) => {
    const [formState, setFormState] = useState<{
        newDebt: string;
        message: string | null;
    }>({
        newDebt: "",
        message: null,
    });

    const perform = async () => {
        if (user.id && user.balance) {
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
                setLoading(false);
            } catch (e) {
                setLoading(false);
            }
        }
    };

    const setMinBalance = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!loading) {
            setLoading(true);
            var button = e.target as HTMLButtonElement;
            const text = button.innerHTML;
            button.innerHTML = "";
            button.classList.add("loading-section");
            var loader = document.createElement("span");
            loader.classList.add("loader");
            button.appendChild(loader);

            await perform();

            button.removeChild(loader);
            button.innerHTML = text;
            button.classList.remove("loading-section");
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

            <div
                className="margin-top-25 margin-bottom-25"
                data-state={loading ? "loading" : "loaded"}
            >
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

            <button
                type="button"
                onClick={setMinBalance}
                disabled={
                    !(formState.newDebt.trim().length > 0) || formState.message !== null
                }
                className="small-general-button text | medium bold touchable green"
            >
                Establecer saldo minimo
            </button>
        </section>
    );
};

export default MinBalanceUser;
