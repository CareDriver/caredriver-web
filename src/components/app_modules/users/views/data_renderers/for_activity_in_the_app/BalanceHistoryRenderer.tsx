import { BalanceHistory } from "@/interfaces/Payment";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";

const BalanceHistoryRenderer = ({
    balanceHistory,
}: {
    balanceHistory: BalanceHistory[] | undefined;
}) => {
    return (
        balanceHistory && (
            <div className="margin-top-50">
                <h2 className="text | bold gray-darker">
                    Historial de las actualizaciones del saldo del usuario
                </h2>
                <div className="debt-wrapper max-width-80">
                    {balanceHistory.map((debt, i) => (
                        <div
                            key={`debt-item-history-${i}`}
                            className="debt-item"
                        >
                            <span className="text | bold medium">
                                {debt.amount}
                                {debt.currency}
                            </span>
                            <span className="text | light">
                                {timestampDateInSpanish(debt.date)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )
    );
};

export default BalanceHistoryRenderer;
