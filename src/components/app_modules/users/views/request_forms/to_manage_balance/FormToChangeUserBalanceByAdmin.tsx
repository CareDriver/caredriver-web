"use client";

import {
    BalanceHistory,
    BalanceHistoryItem,
    Price,
} from "@/interfaces/Payment";
import { UserInterface } from "@/interfaces/UserInterface";
import { updateUser } from "@/components/app_modules/users/api/UserRequester";
import {
    isValidAmount,
    isValidBankNumber,
} from "@/components/app_modules/users/validators/for_data/BalanceValidator";
import { Timestamp } from "firebase/firestore";
import { FormEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { saveBalanceHistoryItem } from "@/components/app_modules/users/api/BalanceHistoryRequester";
import Popup from "@/components/modules/Popup";
import BaseForm from "@/components/form/view/forms/BaseForm";
import { TextField as TextFieldForm } from "@/components/form/models/FormFields";
import { DEFAUL_TEXT_FIELD } from "@/components/form/models/DefaultFields";
import { genDocId } from "@/utils/generators/IdGenerator";
import { PageStateContext } from "@/context/PageStateContext";
import { DEFAULT_FORM_STATE, FormState } from "@/components/form/models/Forms";
import TextField from "@/components/form/view/fields/TextField";
import { isValidTextField } from "@/components/form/validators/FieldValidators";
import SelectionField from "@/components/form/view/fields/SelectionField";
import { isValidChangeReason } from "@/validators/JustificationValidator";
import MoneyBillTransfer from "@/icons/MoneyBillTransfer";

type ReasonOfChangeType = "bankTransactionNumber" | "modificationReason";

const REASON_OF_CHANGE_TYPES: ReasonOfChangeType[] = [
    "bankTransactionNumber",
    "modificationReason",
];

interface Form {
    newBalance: TextFieldForm;
    reasonOfChange: {
        description: TextFieldForm;
        type: ReasonOfChangeType;
    };
}

const DEFAULT_FORM: Form = {
    newBalance: DEFAUL_TEXT_FIELD,
    reasonOfChange: {
        description: DEFAUL_TEXT_FIELD,
        type: "bankTransactionNumber",
    },
};

const FormToChangeUserBalanceByAdmin = ({
    user,
    adminUser,
}: {
    user: UserInterface;
    adminUser: UserInterface;
}) => {
    const { loading, setLoadingAll } = useContext(PageStateContext);
    const [form, setForm] = useState<Form>(DEFAULT_FORM);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [isOpenPopup, setOpenPopup] = useState(false);

    const perform = async () => {
        if (user.id && adminUser.id) {
            try {
                const OLD_BALANCE: Price = user.balance;

                const NEW_BALANCE: Price = {
                    amount: parseFloat(form.newBalance.value),
                    currency: "Bs. (BOB)",
                };
                const DOC_ID = genDocId();
                let balanceItem: BalanceHistoryItem = {
                    id: DOC_ID,
                    dateTime: Timestamp.now(),
                    oldBalance: OLD_BALANCE,
                    previousBalance: NEW_BALANCE,
                    userWhoChanged: adminUser.id,
                };
                if (form.reasonOfChange.type === "bankTransactionNumber") {
                    balanceItem = {
                        ...balanceItem,
                        bankTransactionNumber:
                            form.reasonOfChange.description.value,
                    };
                } else {
                    balanceItem = {
                        ...balanceItem,
                        modificationReason:
                            form.reasonOfChange.description.value,
                    };
                }

                await toast.promise(
                    saveBalanceHistoryItem(DOC_ID, balanceItem),
                    {
                        pending: "Guardando justificativo",
                        success: "Justificativo guardado",
                        error: "Error al guardar tu justificativo, inténtalo de nuevo por favor",
                    },
                );

                const note =
                    form.reasonOfChange.type === "bankTransactionNumber"
                        ? "Numero de Transacción Bancaria - ".concat(
                              form.reasonOfChange.description.value,
                          )
                        : form.reasonOfChange.description.value;

                const newBalanceForHistory: BalanceHistory = {
                    ...OLD_BALANCE,
                    date: Timestamp.now(),
                    balanceRechargeId: DOC_ID,
                    newBalance: NEW_BALANCE,
                    note: note,
                };
                const newHistory: BalanceHistory[] = user.balanceHistory
                    ? [...user.balanceHistory, newBalanceForHistory]
                    : [newBalanceForHistory];
                await toast.promise(
                    updateUser(user.id, {
                        balance: NEW_BALANCE,
                        balanceHistory: newHistory,
                    }),
                    {
                        pending: "Actualizando el saldo del usuario",
                        success: "Saldo actualizado",
                        error: "Error al actualizar el saldo, inténtalo de nuevo",
                    },
                );
                window.location.reload();
            } catch (e) {
                setLoadingAll(false, setFormState);
            }
        }
    };

    const setDebt = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!loading) {
            setLoadingAll(true, setFormState);
            await perform();
        }
    };

    useEffect(() => {
        let isValid: boolean;
        let message: string;

        if (form.reasonOfChange.type === "modificationReason") {
            ({ isValid, message } = isValidChangeReason(
                form.reasonOfChange.description.value,
            ));
        } else {
            ({ isValid, message } = isValidBankNumber(
                form.reasonOfChange.description.value,
            ));
        }

        setForm((prev) => ({
            ...prev,
            reasonOfChange: {
                ...prev.reasonOfChange,
                description: {
                    ...prev.reasonOfChange.description,
                    message: isValid ? null : message,
                },
            },
        }));
    }, [form.reasonOfChange.type]);

    useEffect(() => {
        let isSettingTheReason = isOpenPopup;
        if (isSettingTheReason) {
            setFormState((prev) => ({
                ...prev,
                isValid:
                    isValidTextField(form.newBalance) &&
                    isValidTextField(form.reasonOfChange.description),
            }));
        } else {
            setFormState((prev) => ({
                ...prev,
                isValid: isValidTextField(form.newBalance),
            }));
        }
    }, [form]);

    return (
        <section className="profile-info-wrapper | margin-top-50 max-width-60">
            <h2 className="text medium-big bold | icon-wrapper lb">
                <MoneyBillTransfer />
                Cambiar Saldo |{" "}
                {user.balance
                    ? user.balance.amount + " " + user.balance.currency
                    : "0"}
            </h2>
            <p className="text | gray-dark">
                Ingresa el nuevo monto sera el que tendrá el usuario, necesitas
                justificar la razón del cambio.
            </p>

            <BaseForm
                content={{
                    button: {
                        content: {
                            legend: "Cambiar saldo",
                            buttonClassStyle:
                                "small-general-button | text bold",
                        },
                        behavior: {
                            loading: formState.loading,
                            isValid: formState.isValid,
                        },
                    },
                    styleClasses: "small-form max-width-40",
                }}
                behavior={{
                    loading: formState.loading || loading,
                    onSummit: async (e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        setOpenPopup(true);
                    },
                }}
            >
                <TextField
                    field={{
                        values: form.newBalance,
                        setter: (b) =>
                            setForm((prev) => ({ ...prev, newBalance: b })),
                        validator: isValidAmount,
                    }}
                    legend="Nuevo saldo del usuario"
                />
            </BaseForm>

            <Popup isOpen={isOpenPopup} close={() => setOpenPopup(false)}>
                <div>
                    <h2 className="text | big-medium bold">
                        Razón de cambio
                    </h2>
                    <p className="text | light">
                        Escribe el número de transacción registrada en cuenta
                        bancaria o la razón por la cual esta haciendo este
                        cambio.
                    </p>
                </div>
                <BaseForm
                    content={{
                        button: {
                            content: {
                                legend: "Cambiar saldo",
                            },
                            behavior: {
                                loading: formState.loading,
                                isValid: formState.isValid,
                            },
                        },
                    }}
                    behavior={{
                        loading: formState.loading || loading,
                        onSummit: setDebt,
                    }}
                >
                    <SelectionField
                        field={{
                            value: form.reasonOfChange.type,
                            setter: (v) =>
                                setForm((prev) => ({
                                    ...prev,
                                    reasonOfChange: {
                                        ...prev.reasonOfChange,
                                        type: v as ReasonOfChangeType,
                                    },
                                })),
                        }}
                        options={REASON_OF_CHANGE_TYPES}
                        legend="Tipo de rason de cambio"
                        optionTranslator={(d) =>
                            d === "bankTransactionNumber"
                                ? "Numero de transacción bancaria"
                                : "Justificación del cambio"
                        }
                    />
                    <TextField
                        field={{
                            values: form.reasonOfChange.description,
                            setter: (d) =>
                                setForm((prev) => ({
                                    ...prev,
                                    reasonOfChange: {
                                        ...prev.reasonOfChange,
                                        description: d,
                                    },
                                })),
                            validator:
                                form.reasonOfChange.type ===
                                "modificationReason"
                                    ? isValidChangeReason
                                    : isValidBankNumber,
                        }}
                        legend={
                            form.reasonOfChange.type === "modificationReason"
                                ? "Razón de la modificación"
                                : "Número de transacción"
                        }
                    />
                </BaseForm>
            </Popup>
        </section>
    );
};

export default FormToChangeUserBalanceByAdmin;
