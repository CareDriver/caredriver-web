import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { ServiceStatus } from "../constants/TypeOfServiceStatus";

export interface ServiceStatusForRendering {
    state: ServiceStatus;
    style: string;
}

export function getServiceStatus(service: ServiceRequestInterface): ServiceStatusForRendering {
    let state = {
        state: ServiceStatus.ACTIVE,
        style: "active-state",
    };

    if (service.canceled) {
        state = {
            state: ServiceStatus.CANCELEED,
            style: "canceled-state",
        };
    } else if (service.finished) {
        state = {
            state: ServiceStatus.FINISHED,
            style: "finished-state",
        };
    }

    return state;
}
