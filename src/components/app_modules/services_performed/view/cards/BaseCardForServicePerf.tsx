import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";
import Link from "next/link";
import { getServicePerfStatus } from "../../model/utils/ServiceStatusGetter";
import { ServiceType } from "@/interfaces/Services";
import { routeToServicePerformed } from "@/utils/route_builders/for_services/RouteBuilderForServices";

interface Props {
    service: ServiceRequestInterface;
    typeOfService: ServiceType;
    fakeUserServerId?: string;
    children: undefined | React.ReactNode;
}

const BaseCardForServicePerf: React.FC<Props> = ({
    service,
    typeOfService,
    fakeUserServerId,
    children,
}) => {
    const HAS_FAKED_ID = service.fakedId !== undefined;
    const LINK_TO = service.fakedId
        ? routeToServicePerformed(
              typeOfService,
              service.fakedId,
              fakeUserServerId,
          )
        : undefined;
    let serviceState = getServicePerfStatus(service);

    const renderBodyCard = () => (
        <>
            {service.createdAt && (
                <h3 className="text | medium-big bolder">
                    {timestampDateInSpanish(service.createdAt)}
                </h3>
            )}
            {service.price && service.price.price && (
                <h3 className="text | bolder margin-bottom-25">
                    {service.price.price} {service.price.currency}
                </h3>
            )}

            {children && children}
        </>
    );

    const renderStatusCard = () => (
        <span
            className={`service-item-state text |  bolder | ${serviceState.style}`}
        >
            Estado : {serviceState.state}
        </span>
    );

    if (!HAS_FAKED_ID || !LINK_TO) {
        return (
            <div
                className={`service-item-wrapper | disabled | ${
                    service.canceled && "canceled-service"
                }`}
                title="El servicio no fue registrado correctamente"
            >
                {renderBodyCard()}
                {renderStatusCard()}
                <div className="form-section-message">
                    El servicio no fue registrado correctamente - No se pueden
                    ver mas detalles
                </div>
            </div>
        );
    }

    return (
        <Link
            href={LINK_TO}
            className={`service-item-wrapper | touchable ${
                service.canceled && "canceled-service"
            }`}
        >
            {renderBodyCard()}
            {renderStatusCard()}
        </Link>
    );
};

export default BaseCardForServicePerf;
