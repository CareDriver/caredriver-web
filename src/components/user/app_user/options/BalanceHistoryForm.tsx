import { BalanceHistoryItem } from "@/interfaces/Payment";
import {
    isValidBankNumber,
    isValidChangeReason,
} from "@/utils/validator/debt/DebtValidator";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

export interface BalanceHistoryItemForm {
    reasonType: "bankTransactionNumber" | "modificationReason";
    reason: {
        value: string;
        message: string | null;
    };
}

const BalanceHistoryForm = ({
    balanceHistoryItem,
    setBalanceHistoryItem,
}: {
    balanceHistoryItem: BalanceHistoryItemForm;
    setBalanceHistoryItem: Dispatch<SetStateAction<BalanceHistoryItemForm>>;
}) => {
    const verifyBankTransactionNumber = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const { isValid, message } = isValidBankNumber(newValue);
        setBalanceHistoryItem({
            ...balanceHistoryItem,
            reason: {
                value: newValue,
                message: isValid ? null : message,
            },
        });
    };

    const verifyReason = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const { isValid, message } = isValidChangeReason(newValue);
        setBalanceHistoryItem({
            ...balanceHistoryItem,
            reason: {
                value: newValue,
                message: isValid ? null : message,
            },
        });
    };

    return (
        <div className="margin-bottom-25">
            <div>
                <h2 className="text | big-medium bolder">Razon de cambio</h2>
                <p className="text | light">
                    Escribe el número de transacción registrada en cuenta bancaria o la
                    razon por la cual esta haciendo este cambio.
                </p>
            </div>
            <div className="double-button-wrapper | margin-top-25 margin-bottom-25">
                <button
                    className={`option-button ${
                        balanceHistoryItem.reasonType === "bankTransactionNumber" &&
                        "selected"
                    }`}
                    type="button"
                    onClick={() =>
                        setBalanceHistoryItem({
                            reasonType: "bankTransactionNumber",
                            reason: {
                                value: "",
                                message: null,
                            },
                        })
                    }
                >
                    Número de transacción registrada en cuenta bancaria
                </button>
                <button
                    className={`option-button ${
                        balanceHistoryItem.reasonType === "modificationReason" &&
                        "selected"
                    }`}
                    type="button"
                    onClick={() =>
                        setBalanceHistoryItem({
                            reasonType: "modificationReason",
                            reason: {
                                value: "",
                                message: null,
                            },
                        })
                    }
                >
                    Razon por la cual modificas el saldo
                </button>
            </div>

            <fieldset className="form-section">
                <input
                    type="text"
                    placeholder=""
                    className="form-section-input"
                    name="fullname"
                    value={balanceHistoryItem.reason.value}
                    onChange={(e) =>
                        balanceHistoryItem.reasonType === "modificationReason"
                            ? verifyReason(e)
                            : verifyBankTransactionNumber(e)
                    }
                />
                <legend className="form-section-legend">
                    {balanceHistoryItem.reasonType === "modificationReason"
                        ? "Razon de la modificacion"
                        : "Número de transacción"}
                </legend>
                {balanceHistoryItem.reason.message && (
                    <small>{balanceHistoryItem.reason.message}</small>
                )}
            </fieldset>
        </div>
    );
};

export default BalanceHistoryForm;
