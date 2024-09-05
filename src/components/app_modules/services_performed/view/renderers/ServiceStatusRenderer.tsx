import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { getServicePerfStatus } from "../../model/utils/ServiceStatusGetter";
import CircleCheck from "@/icons/CircleCheck";
import CircleXmark from "@/icons/CircleXmark";
import Clock from "@/icons/Clock";

const ServiceStatusRenderer = ({
    service,
    size,
}: {
    service: ServiceRequestInterface;
    size?: "small" | "medium";
}) => {
    const SIZE_FONT = !size || size === "medium" ? "medium-big" : "small";
    let serviceState = getServicePerfStatus(service);

    if (service.finished) {
        return (
            <h2
                className={`icon-wrapper green-icon | text ${SIZE_FONT} bolder capitalize `.concat(
                    serviceState.styleFont,
                )}
            >
                <CircleCheck />
                {serviceState.state}
            </h2>
        );
    } else if (service.canceled) {
        return (
            <h2
                className={`icon-wrapper red-icon | text | ${SIZE_FONT} bolder capitalize `.concat(
                    serviceState.styleFont,
                )}
            >
                <CircleXmark />
                {serviceState.state}
            </h2>
        );
    } else {
        return (
            <h2
                className={`icon-wrapper yellow-icon | text | ${SIZE_FONT} bolder capitalize `.concat(
                    serviceState.styleFont,
                )}
            >
                <Clock />
                {serviceState.state}
            </h2>
        );
    }
};

export default ServiceStatusRenderer;
