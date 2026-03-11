import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { ServiceType } from "@/interfaces/Services";
import { collection } from "firebase/firestore";

export function getPathCollectionOfServicesPerf(
  type: ServiceType,
): Collections {
  switch (type) {
    case "driver":
      return Collections.DriverServices;
    case "mechanical":
      return Collections.MechanicalServices;
    case "tow":
      return Collections.TowsServices;
    default:
      return Collections.CarWashServices;
  }
}

export function getCollectionOfServicesPerf(type: ServiceType) {
  let collectionPath = getPathCollectionOfServicesPerf(type);
  return collection(firestore, collectionPath);
}
