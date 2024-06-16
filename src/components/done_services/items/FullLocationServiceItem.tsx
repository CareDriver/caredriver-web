import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { getFormatDate } from "@/utils/parser/ForDate";
import Link from "next/link";

const FullLocationServiceItem = ({
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
                {service.createdAt && (
                    <h3 className="text | medium-big bolder">
                        {getFormatDate(service.createdAt.toDate())}
                    </h3>
                )}
                {service.price && service.price.price && (
                    <h3 className="text | bolder margin-bottom-25">
                        {service.price.price} {service.price.currency}
                    </h3>
                )}

                <div className="margin-bottom-15">
                    <h4 className="text | bold gray-dark">Desde</h4>
                    <p className="text | gray-dark">
                        {service.pickupLocation.locationName}
                    </p>
                </div>

                {service.deliveryLocation && (
                    <div className="margin-bottom-15">
                        <h4 className="text | bold gray-dark">Hasta</h4>
                        <p className="text | gray-dark">
                            {service.deliveryLocation.locationName}
                        </p>
                    </div>
                )}

                {getStatus()}
            </Link>
        )
    );
};

export default FullLocationServiceItem;
