import { BalanceHistory, Price } from "@/interfaces/Payment";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";

const BalanceHistoryRenderer = ({
    balanceHistory,
}: {
    balanceHistory: BalanceHistory[] | undefined;
}) => {
    const getDifference = (oldPrice: number, newPrice: number): number => {
        return newPrice - oldPrice;
    };

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
                            className={`debt-item max-width-50 ${
                                debt.newBalance
                                    ? getDifference(
                                          debt.amount,
                                          debt.newBalance.amount,
                                      ) < 0
                                        ? "decreased"
                                        : "increased"
                                    : ""
                            }`}
                        >
                            <span className="text | bold medium">
                                {debt.newBalance
                                    ? getDifference(
                                          debt.amount,
                                          debt.newBalance.amount,
                                      ) > 0
                                        ? "+".concat(
                                              getDifference(
                                                  debt.amount,
                                                  debt.newBalance.amount,
                                              ).toString(),
                                          )
                                        : getDifference(
                                              debt.amount,
                                              debt.newBalance.amount,
                                          )
                                    : debt.amount}
                                {debt.currency}
                            </span>
                            <span className="text | light">
                                {timestampDateInSpanish(debt.date)}
                            </span>
                            {debt.note && (
                                <div className="margin-top-25">
                                    <b className="text | bold">Nota: </b>
                                    <i className="text | light">{debt.note}</i>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    );
};

export default BalanceHistoryRenderer;
