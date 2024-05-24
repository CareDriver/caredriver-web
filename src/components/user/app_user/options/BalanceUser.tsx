"use client";

import MoneyBillWave from "@/icons/MoneyBillWave";
import { BalanceHistory, BalanceHistoryItem, Price } from "@/interfaces/Payment";
import { UserInterface } from "@/interfaces/UserInterface";
import { updateUser } from "@/utils/requests/UserRequester";
import { isValidAmount } from "@/utils/validator/debt/DebtValidator";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import BalanceHistoryForm, { BalanceHistoryItemForm } from "./BalanceHistoryForm";
import "@/styles/modules/popup.css";
import PopupForm from "@/components/form/PopupForm";
import { nanoid } from "nanoid";
import { saveBalanceHistoryItem } from "@/utils/requests/BalanceHistoryRequester";

const BalanceUser = ({
    user,
    adminUser,
}: {
    user: UserInterface;
    adminUser: UserInterface;
}) => {
    const [formState, setFormState] = useState<{
        newDebt: string;
        loading: boolean;
        message: string | null;
    }>({
        newDebt: "",
        loading: false,
        message: null,
    });

    const [balanceHistory, setBalanceHistory] = useState<BalanceHistoryItemForm>({
        reason: {
            value: "",
            message: null,
        },
        reasonType: "bankTransactionNumber",
    });

    const [isOpenPopup, setOpenPopup] = useState(false);

    const setDebt = async () => {
        if (!formState.loading && user.id && adminUser.id) {
            setFormState({
                ...formState,
                loading: true,
            });
            try {
                const balanceHistoryId = nanoid();
                var balanceItem: BalanceHistoryItem = {
                    id: balanceHistoryId,
                    dateTime: Timestamp.fromDate(new Date()),
                    oldBalance: user.balance,
                    previousBalance: {
                        amount: parseFloat(formState.newDebt),
                        currency: "Bs. (BOB)",
                    },
                    userWhoChanged: adminUser.id,
                };
                if (balanceHistory.reasonType === "bankTransactionNumber") {
                    balanceItem = {
                        ...balanceItem,
                        bankTransactionNumber: balanceHistory.reason.value,
                    };
                } else {
                    balanceItem = {
                        ...balanceItem,
                        modificationReason: balanceHistory.reason.value,
                    };
                }

                await toast.promise(
                    saveBalanceHistoryItem(balanceHistoryId, balanceItem),
                    {
                        pending: "Guardando justificatorio",
                        success: "Justificatio guardado",
                        error: "Error al guardar tu justificatio, intentalo de nuevo por favor",
                    },
                );
                const debt: Price = {
                    amount: parseFloat(formState.newDebt),
                    currency: "Bs. (BOB)",
                };
                const newHistory: BalanceHistory[] = user.balanceHistory
                    ? [
                          ...user.balanceHistory,
                          {
                              ...debt,
                              date: Timestamp.fromDate(new Date()),
                              balanceRechargeId: balanceHistoryId,
                          },
                      ]
                    : [
                          {
                              ...debt,
                              date: Timestamp.fromDate(new Date()),
                              balanceRechargeId: balanceHistoryId,
                          },
                      ];
                await toast.promise(
                    updateUser(user.id, {
                        balance: debt,
                        balanceHistory: newHistory,
                    }),
                    {
                        pending: "Actualizando el saldo del usuario",
                        success: "Saldo actualizado",
                        error: "Error al actualizar el saldo, intantalo de nuevo",
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
                Saldo |{" "}
                {user.balance ? user.balance.amount + " " + user.balance.currency : "0"}
            </h2>
            <p className="text | gray-dark">
                Ingresa el nuevo monto de saldo del usuario.
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
                        Nuevo saldo {user.balance.currency}
                    </legend>
                    {formState.message && <small>{formState.message}</small>}
                </fieldset>
            </div>

            <PopupForm
                isOpen={isOpenPopup}
                close={() => setOpenPopup(false)}
                loading={formState.loading}
                onSummit={setDebt}
                isSecondButtonAble={
                    !balanceHistory.reason.message &&
                    balanceHistory.reason.value.trim().length > 0
                }
            >
                <BalanceHistoryForm
                    balanceHistoryItem={balanceHistory}
                    setBalanceHistoryItem={setBalanceHistory}
                />
            </PopupForm>

            <div>
                <button
                    type="button"
                    onClick={() => setOpenPopup(true)}
                    disabled={
                        !(!formState.message && formState.newDebt.trim().length > 0)
                    }
                    className="small-general-button text | medium bold touchable green"
                >
                    Establecer nuevo saldo
                </button>
            </div>
        </section>
    );
};

export default BalanceUser;
