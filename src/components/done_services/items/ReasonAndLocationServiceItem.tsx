import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { getFormatDate } from "@/utils/parser/ForDate";
import Link from "next/link";

const ReasonAndLocationServiceItem = ({
    link,
    service,
}: {
    link: string;
    service: ServiceRequestInterface;
}) => {
    const getStatus = () => {
        if (service.canceled) {
            return (
                <span className="service-item-state text | canceled-state | bolder">
                    Estado : Cancelado
                </span>
            );
        } else if (service.finished) {
            return (
                <span className="service-item-state text | bolder">
                    Estado : Finalizado
                </span>
            );
        } else if (service.isRequestActive) {
            return (
                <span className="service-item-state text | bolder">Estado : Activo</span>
            );
        }
    };

    return (
        service.id && (
            <Link
                href={link}
                className={`service-item-wrapper | touchable ${
                    service.canceled && "canceled-service"
                }`}
            >  
                {service.requestReason && service.requestReason.length > 0 && (
                    <h3 className="text | big-medium-v4 bolder">
                        {service.requestReason}
                    </h3>
                )}
                {service.createdAt && (
                    <h3 className="text | bolder">
                        {getFormatDate(service.createdAt.toDate())}
                    </h3>
                )}

                <div className="margin-top-25 margin-bottom-15">
                    <h4 className="text | bold gray-dark">Ubicacion</h4>
                    <p className="text | gray-dark">
                        {service.pickupLocation.locationName}
                    </p>
                </div>

                {getStatus()}
            </Link>
        )
    );
};

export default ReasonAndLocationServiceItem;
