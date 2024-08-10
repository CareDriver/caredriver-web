"use client";

import MoneyBillWave from "@/icons/MoneyBillWave";
import { BalanceHistory, BalanceHistoryItem, Price } from "@/interfaces/Payment";
import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { updateUser } from "@/utils/requests/UserRequester";
import {
    isValidAmount,
    isValidIncreaseAmount,
} from "@/utils/validator/debt/DebtValidator";
import { Timestamp } from "firebase/firestore";
import { SyntheticEvent, useState } from "react";
import { toast } from "react-toastify";
import BalanceHistoryForm, { BalanceHistoryItemForm } from "./BalanceHistoryForm";
import PopupForm from "@/components/form/PopupForm";
import { nanoid } from "nanoid";
import { saveBalanceHistoryItem } from "@/utils/requests/BalanceHistoryRequester";

const BalanceUser = ({
    user,
    adminUser,
    loading,
    setLoading,
}: {
    user: UserInterface;
    adminUser: UserInterface;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}) => {
    const isBalancer: boolean = adminUser.role === UserRole.BalanceRecharge;
    const [formState, setFormState] = useState<{
        newDebt: string;
        message: string | null;
    }>({
        newDebt: "",
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

    const perform = async () => {
        if (user.id && adminUser.id) {
            try {
                const debt: Price = isBalancer
                    ? {
                          amount: user.balance.amount + parseFloat(formState.newDebt),
                          currency: "Bs. (BOB)",
                      }
                    : {
                          amount: parseFloat(formState.newDebt),
                          currency: "Bs. (BOB)",
                      };
                const balanceHistoryId = nanoid();
                var balanceItem: BalanceHistoryItem = {
                    id: balanceHistoryId,
                    dateTime: Timestamp.now(),
                    oldBalance: user.balance,
                    previousBalance: debt,
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
                        pending: "Guardando justificativo",
                        success: "Justificatio guardado",
                        error: "Error al guardar tu justificatio, inténtalo de nuevo por favor",
                    },
                );

                const newHistory: BalanceHistory[] = user.balanceHistory
                    ? [
                          ...user.balanceHistory,
                          {
                              ...debt,
                              date: Timestamp.now(),
                              balanceRechargeId: balanceHistoryId,
                          },
                      ]
                    : [
                          {
                              ...debt,
                              date: Timestamp.now(),
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
                        error: "Error al actualizar el saldo, inténtalo de nuevo",
                    },
                );
                window.location.reload();
                setLoading(false);
            } catch (e) {
                setLoading(false);
            }
        }
    };

    const setDebt = async (e: SyntheticEvent) => {
        e.preventDefault();
        if (!loading) {
            setLoading(true);
            await perform();
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
                {isBalancer
                    ? " Ingresa el monto que pago el usuario para aumentar su saldo (Solo puedes aumentar el saldo del usuario)"
                    : "Ingresa el nuevo monto de saldo del usuario."}
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
                            const { isValid, message } = isBalancer
                                ? isValidIncreaseAmount(newDebt)
                                : isValidAmount(newDebt);
                            setFormState({
                                ...formState,
                                newDebt,
                                message: isValid ? null : message,
                            });
                        }}
                    />
                    <legend className="form-section-legend">
                        {isBalancer
                            ? `Saldo que pago el usuario en ${user.balance.currency}`
                            : `Nuevo saldo en ${user.balance.currency}`}
                    </legend>
                    {formState.message && <small>{formState.message}</small>}
                </fieldset>
            </div>

            <button
                type="button"
                onClick={() => setOpenPopup(true)}
                disabled={!(!formState.message && formState.newDebt.trim().length > 0)}
                className="small-general-button text | medium bold touchable green"
            >
                {isBalancer ? "Aumentar saldo" : "Establecer nuevo saldo"}
            </button>

            <PopupForm
                isOpen={isOpenPopup}
                close={() => setOpenPopup(false)}
                loading={loading}
                onSummit={setDebt}
                isSecondButtonAble={
                    !balanceHistory.reason.message &&
                    balanceHistory.reason.value.trim().length > 0
                }
                doSomethingText={isBalancer ? "Aumentar saldo" : "Cambiar saldo"}
            >
                <BalanceHistoryForm
                    loading={loading}
                    balanceHistoryItem={balanceHistory}
                    setBalanceHistoryItem={setBalanceHistory}
                />
            </PopupForm>
        </section>
    );
};

export default BalanceUser;
