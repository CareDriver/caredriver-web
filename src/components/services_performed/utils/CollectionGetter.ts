import { Collections } from "@/firebase/CollecionNames";

export function getPathFromPerformedServicesCollection(
    type: "driver" | "mechanic" | "tow" | "laundry",
): Collections {
    switch (type) {
        case "driver":
            return Collections.DriverServices;
        case "mechanic":
            return Collections.MechanicalServices;
        case "tow":
            return Collections.TowsServices;
        default:
            return Collections.CarWashServices;
    }
}
