import { ComissionHistory } from "@/interfaces/Payment";
import EntepriseComissionHistoryCard from "../cards/EntepriseComissionHistoryCard";
import "@/styles/components/debt-user.css";
import Clock from "@/icons/Clock";

interface Props {
    history: ComissionHistory[] | undefined;
}

const EnterpriseComissionHistoryRenderer: React.FC<Props> = ({ history }) => {
    if (!history || history.length == 0) {
        return;
    }

    return (
        <section className="margin-top-25">
            <h2 className="text | bold gray-darker | icon-wrapper">
                <Clock /> Historial de servicios de los trabajadores
            </h2>
            <div className="debt-wrapper | no-border">
                {history.map((item, i) => (
                    <EntepriseComissionHistoryCard
                        comission={item}
                        key={`enterprise-commision-history-item-${i}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default EnterpriseComissionHistoryRenderer;
