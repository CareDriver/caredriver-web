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
    loading,
}: {
    balanceHistoryItem: BalanceHistoryItemForm;
    setBalanceHistoryItem: Dispatch<SetStateAction<BalanceHistoryItemForm>>;
    loading: boolean;
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
                <h2 className="text | big-medium bolder">Razón de cambio</h2>
                <p className="text | light">
                    Escribe el número de transacción registrada en cuenta bancaria o la
                    razón por la cual esta haciendo este cambio.
                </p>
            </div>
            <div
                className="double-button-wrapper | margin-top-25 margin-bottom-25"
                data-state={loading ? "loading" : "loaded"}
            >
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
                    Razón por la cual modificas el saldo
                </button>
            </div>

            <fieldset className="form-section" data-state={loading ? "loading" : "loaded"}>
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
                        ? "Razón de la modificación"
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
