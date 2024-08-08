import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { getFormatDate } from "@/utils/parser/ForDate";
import Link from "next/link";
import { getServiceStatus } from "../utils/ServiceStatusGetter";
import { TypeOfServicePerformed } from "../constants/TypeOfServicePerformed";

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
    const LINK_FOR_PERF =
        typeOfPerf === TypeOfServicePerformed.Requested ? "servicerequests" : "services";
    const LINK_TO = `/admin/users/${userId}/${LINK_FOR_PERF}/${typeOfService}/${service.fakedId}`;
    let serviceState = getServiceStatus(service);

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
        <span className={`service-item-state text |  bolder | ${serviceState.style}`}>
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
