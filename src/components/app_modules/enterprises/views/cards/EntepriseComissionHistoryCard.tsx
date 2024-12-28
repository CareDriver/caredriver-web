import { ComissionHistory } from "@/interfaces/Payment";
import { routeToServicePerformed } from "@/utils/route_builders/for_services/RouteBuilderForServices";

const EntepriseComissionHistoryCard = ({
    comission,
}: {
    comission: ComissionHistory;
}) => {
    const goToService = () => {
        window.open(
            routeToServicePerformed(comission.serviceType, comission.serviceId),
            "_blank",
        );
    };

    return (
        <button onClick={goToService} className="debt-item | left touchable">
            <h2 className="text | medium-big bold">
                {comission.amount.amount} {comission.amount.currency}
            </h2>
            <small className="text | small | light">
                Click para ir al Servicio
            </small>
        </button>
    );
};

export default EntepriseComissionHistoryCard;
