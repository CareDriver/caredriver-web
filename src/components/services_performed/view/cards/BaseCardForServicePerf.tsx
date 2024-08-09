import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { getFormatDate } from "@/utils/parser/ForDate";
import Link from "next/link";
import { getServicePerfStatus } from "../../model/utils/ServiceStatusGetter";
import { TypeOfServicePerformed } from "../../model/models/TypeOfServicePerformed";
import { buildLinkForServicePerformed } from "../../model/utils/LinkBuilder";

const BaseCardForServicePerf = ({
    userId,
    service,
    typeOfService,
    typeOfPerf,
    children,
}: {
    userId: string;
    service: ServiceRequestInterface;
    typeOfService: "driver" | "mechanic" | "tow" | "laundry";
    typeOfPerf: TypeOfServicePerformed;
    children: undefined | React.ReactNode;
}) => {
    const HAS_FAKED_ID = service.fakedId !== undefined;
    const LINK_TO = buildLinkForServicePerformed(
        userId,
        service.fakedId,
        typeOfService,
        typeOfPerf,
    );
    let serviceState = getServicePerfStatus(service);

    const renderBodyCard = () => (
        <>
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

    if (!HAS_FAKED_ID) {
        return (
            <div
                className={`service-item-wrapper | disabled | ${
                    service.canceled && "canceled-service"
                }`}
                title="El servicio no fue registrado correctamente"
            >
                {renderBodyCard()}
                {renderStatusCard()}
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
