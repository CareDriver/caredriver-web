import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import { ServiceStatus } from "../models/TypeOfServiceStatus";

export interface ServiceStatusForRendering {
    state: ServiceStatus;
    style: string;
    styleFont: string;
}

export function getServicePerfStatus(
    service: ServiceRequestInterface,
): ServiceStatusForRendering {
    let state = {
        state: ServiceStatus.ACTIVE,
        style: "active-state",
        styleFont: "yellow",
    };

    if (service.canceled) {
        state = {
            state: ServiceStatus.CANCELEED,
            style: "canceled-state",
            styleFont: "red",
        };
    } else if (service.finished) {
        state = {
            state: ServiceStatus.FINISHED,
            style: "finished-state",
            styleFont: "green",
        };
    }

    return state;
}
