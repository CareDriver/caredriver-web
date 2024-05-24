import { UserInterface } from "@/interfaces/UserInterface";
import { toformatDate } from "@/utils/parser/ForDate";

const DebtHistory = ({ user }: { user: UserInterface }) => {
    return (
        user.balanceHistory && (
            <div className="margin-top-50">
                <h2 className="text | bold gray-darker">Historial de las actualizaciones del saldo del usuario</h2>
                <div className="debt-wrapper">
                    {user.balanceHistory.map((debt, i) => (
                        <div key={`debt-item-history-${i}`} className="debt-item">
                            <span className="text | bold medium">
                                {debt.amount}
                                {debt.currency}
                            </span>
                            <span className="text | light">
                                {toformatDate(debt.date.toDate())}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )
    );
};

export default DebtHistory;
