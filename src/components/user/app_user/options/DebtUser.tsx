"use client";

import MoneyBillWave from "@/icons/MoneyBillWave";
import { Price } from "@/interfaces/Payment";
import { UserInterface } from "@/interfaces/UserInterface";
import { updateUser } from "@/utils/requests/UserRequester";
import { isValidAmount } from "@/utils/validator/debt/DebtValidator";
import { Timestamp } from "firebase/firestore";
import { MouseEventHandler, SyntheticEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

const DebtUser = ({ user }: { user: UserInterface }) => {
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

            if (!user.currentDebtWithTheApp) {
                valid = true;
            }
            if (user.currentDebtWithTheApp && user.currentDebtWithTheApp.amount <= 0) {
                valid = true;
            }

            return valid;
        }
    };

    const validToDisableV = validToDisable();

    const payAllDebt = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!formState.loading && user.id && user.currentDebtWithTheApp) {
            setFormState({
                ...formState,
                loading: true,
            });
            try {
                const debt = user.currentDebtWithTheApp;
                const newHistory = user.appPaymentHistory
                    ? [
                          ...user.appPaymentHistory,
                          {
                              ...debt,
                              date: Timestamp.fromDate(new Date()),
                          },
                      ]
                    : [
                          {
                              ...debt,
                              date: Timestamp.fromDate(new Date()),
                          },
                      ];
                await toast.promise(
                    updateUser(user.id, {
                        currentDebtWithTheApp: {
                            amount: 0,
                            currency: "Bs. (BOB)",
                        },
                        appPaymentHistory: newHistory,
                    }),
                    {
                        pending: "Estableciendo como deuda cobrada",
                        success: "Deuda cobrada",
                        error: "Error al cobrar toda la deuda",
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

    const setDebt = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!formState.loading && user.id && user.currentDebtWithTheApp) {
            setFormState({
                ...formState,
                loading: true,
            });
            try {
                const currentDebt = user.currentDebtWithTheApp.amount;
                const debt: Price = {
                    amount: parseFloat(formState.newDebt),
                    currency: "Bs. (BOB)",
                };
                const newHistory = user.appPaymentHistory
                    ? [
                          ...user.appPaymentHistory,
                          {
                              ...debt,
                              date: Timestamp.fromDate(new Date()),
                          },
                      ]
                    : [
                          {
                              ...debt,
                              date: Timestamp.fromDate(new Date()),
                          },
                      ];
                await toast.promise(
                    updateUser(user.id, {
                        currentDebtWithTheApp: {
                            amount: currentDebt - debt.amount,
                            currency: "Bs. (BOB)",
                        },
                        appPaymentHistory: newHistory,
                    }),
                    {
                        pending: "Estableciendo nueva deuda",
                        success: "Establecido",
                        error: "Error al establcer la nueva deuda, intantalo de nuevo",
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
                Deuda |{" "}
                {user.currentDebtWithTheApp
                    ? user.currentDebtWithTheApp.amount +
                      " " +
                      user.currentDebtWithTheApp.currency
                    : "0"}
            </h2>
            <p className="text | gray-dark">
                Ingresa el monto que pago el usuario, toda el monto si ya pago todo
            </p>

            <fieldset className="form-section | margin-top-25">
                <input
                    type="text"
                    placeholder=""
                    className="form-section-input"
                    name="fullname"
                    value={formState.newDebt}
                    onChange={(e) => {
                        var newDebt = e.target.value;
                        const { isValid, message } = isValidAmount(
                            newDebt,
                            user.currentDebtWithTheApp?.amount,
                        );
                        setFormState({
                            ...formState,
                            newDebt,
                            message: isValid ? null : message,
                        });
                    }}
                />
                <legend className="form-section-legend">Monto pagado</legend>
                {formState.message && <small>{formState.message}</small>}
            </fieldset>

            {
                <div
                    className="row-wrapper | gap-20 margin-top-25"
                    data-state={formState.loading ? "loading" : "loaded"}
                >
                    <button
                        type="button"
                        disabled={validToDisableV || formState.message !== null}
                        onClick={payAllDebt}
                        className="small-general-button text | medium bold touchable green"
                    >
                        Deuda cobrada
                    </button>
                    <button
                        type="button"
                        disabled={validToDisableV || formState.message !== null}
                        onClick={setDebt}
                        className="small-general-button text | medium bold touchable yellow"
                    >
                        Actualizar Deuda
                    </button>
                </div>
            }
        </section>
    );
};

export default DebtUser;
