import { UserInterface } from "@/interfaces/UserInterface";
import { toformatDate } from "@/utils/parser/ForDate";

const DebtHistory = ({ user }: { user: UserInterface }) => {
    return (
        user.appPaymentHistory && (
            <div className="margin-top-50 margin-bottom-50">
                <h2 className="text | bold gray-darker">Historial de pagos</h2>
                {user.appPaymentHistory.map((debt, i) => (
                    <div key={`debt-item-history-${i}`}>
                        {debt.amount}
                        {debt.currency} - {toformatDate(debt.date.toDate())}
                    </div>
                ))}
            </div>
        )
    );
};

export default DebtHistory;
