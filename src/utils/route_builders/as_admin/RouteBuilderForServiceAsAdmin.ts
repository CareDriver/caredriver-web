import { ServiceType } from "@/interfaces/Services";

function serviceRoute(type: ServiceType): string {
    switch (type) {
        case "driver":
            return "driver";
        case "mechanical":
            return "mechanic";
        case "laundry":
            return "laundry";
        default:
            return "craneoperator";
    }
}

export function routeToServicesRequestedByUser(
    type: ServiceType,
    userId: string,
): string {
    return "/admin/service/many/requested/"
        .concat(serviceRoute(type))
        .concat("/")
        .concat(userId);
}

export function routeToServicesServedByUser(
    type: ServiceType,
    userId: string,
): string {
    return "/admin/service/many/served/"
        .concat(serviceRoute(type))
        .concat("/")
        .concat(userId);
}

export function routeToServicePerformed(
    type: ServiceType,
    serviceId: string,
): string {
    return "/admin/service/only/performed/"
        .concat(serviceRoute(type))
        .concat("/")
        .concat(serviceId);
}
