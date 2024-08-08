import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { getServicePerfStatus } from "../utils/ServiceStatusGetter";

const RendererOfServiceStatusPerf = ({
    service,
}: {
    service: ServiceRequestInterface;
}) => {
    let serviceState = getServicePerfStatus(service);

    if (service.finished) {
        return (
            <h2 className={"text | medium-big bolder ".concat(serviceState.styleFont)}>
                {serviceState.state}
            </h2>
        );
    } else if (service.canceled) {
        return (
            <h2 className={"text | medium-big bolder ".concat(serviceState.styleFont)}>
                {serviceState.state}
            </h2>
        );
    } else {
        return (
            <h2 className={"text | medium-big bolder ".concat(serviceState.styleFont)}>
                En {serviceState.state}
            </h2>
        );
    }
};

export default RendererOfServiceStatusPerf;
