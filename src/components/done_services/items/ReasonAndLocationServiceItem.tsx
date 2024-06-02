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
            return <span>Estado : Cancelado</span>;
        } else if (service.finished) {
            return <span>Estado : Finalizado</span>;
        } else if (service.isRequestActive) {
            return <span>Estado : Activo</span>;
        }
    };

    return (
        service.id && (
            <Link href={link}>
                {service.requestReason && service.requestReason.length > 0 && (
                    <h3 className="text | bold margin-bottom-25">
                        {service.requestReason}
                    </h3>
                )}
                {service.createdAt && (
                    <h3 className="text | medium-big bold">
                        {getFormatDate(service.createdAt.toDate())}
                    </h3>
                )}

                <div className="margin-bottom-15">
                    <h4 className="text | bold gray-dark">Ubicacion</h4>
                    <p className="text | gray-dark">
                        {service.deliveryLocation?.locationName}
                    </p>
                </div>

                {getStatus()}
            </Link>
        )
    );
};

export default ReasonAndLocationServiceItem;
