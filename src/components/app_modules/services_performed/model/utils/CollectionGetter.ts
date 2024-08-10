import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { collection } from "firebase/firestore";

export function getPathCollectionOfServicesPerf(
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

export function getCollectionOfServicesPerf(
    type: "driver" | "mechanic" | "tow" | "laundry",
) {
    let collectionPath = getPathCollectionOfServicesPerf(type);
    return collection(firestore, collectionPath);
}
