import { ServiceType } from "@/interfaces/Services";

const BASE_ROUTER = "/user/userserver";

export function routeToRenewLicenseAsUser(
    typeOfVehicle: "tow" | "car" | "motorcycle",
): string {
    const vehicleRouter = () => {
        switch (typeOfVehicle) {
            case "car":
                return "driver/car";
            case "motorcycle":
                return "driver/motorcycle";
            default:
                return "craneoperator";
        }
    };

    return BASE_ROUTER.concat("/renew/").concat(vehicleRouter());
}

function serviceRoute(type: ServiceType): string {
    switch (type) {
        case "driver":
            return "driver";
        case "mechanical":
            return "mechanic";
        case "laundry":
            return "lauderer";
        default:
            return "craneoperator";
    }
}

export function routeToRequestToBeServerUserAsUser(type: ServiceType): string {
    return BASE_ROUTER.concat("/request/new/").concat(serviceRoute(type));
}
