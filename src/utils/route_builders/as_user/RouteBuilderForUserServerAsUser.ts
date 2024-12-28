import { VehicleToAddAsDriver } from "@/components/app_modules/server_users/models/DriverRegistration";
import { ServiceType } from "@/interfaces/Services";
const BASE_ROUTER = "/user/userserver";

export function routeToRenewLicenseAsUser(
    typeOfVehicle: "tow" | "car" | "motorcycle",
): string {
    const serviceRoute = () => {
        switch (typeOfVehicle) {
            case "car":
                return "driver/car";
            case "motorcycle":
                return "driver/motorcycle";
            default:
                return "craneoperator";
        }
    };

    return BASE_ROUTER.concat("/renew/license/").concat(serviceRoute());
}

export function routeToRenewEnterpriseAsUser(
    typeOfVehicle: ServiceType,
): string {
    const serviceRoute = (type: ServiceType): string => {
        switch (type) {
            case "driver":
                return "driverenterprise";
            case "mechanical":
                return "mechanicalworkshop";
            case "laundry":
                return "laundry";
            default:
                return "crane";
        }
    };

    return BASE_ROUTER.concat("/renew/enterprise/").concat(
        serviceRoute(typeOfVehicle),
    );
}

export function routeToRequestToBeServerUserAsUser(type: ServiceType): string {
    const serviceRoute = (type: ServiceType): string => {
        switch (type) {
            case "driver":
                return "driver";
            case "mechanical":
                return "mechanic";
            case "laundry":
                return "launderer";
            default:
                return "craneoperator";
        }
    };

    return BASE_ROUTER.concat("/service/").concat(serviceRoute(type));
}

export function routeToRequestToRegisterNewVehicleAsIndependent(
    type: VehicleToAddAsDriver,
): string {
    return BASE_ROUTER.concat("/service/driver/vehicle/").concat(type);
}
