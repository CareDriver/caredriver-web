import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { ServiceType } from "@/interfaces/Services";
import { collection, getDocs, query, where } from "firebase/firestore";

export class RequestLimitValidatorToChangeAssociatedEnterprise {
  hasRequestsSent = async (
    userId: string,
    vehicleType: ServiceType,
  ): Promise<boolean> => {
    const collectionConnection = collection(
      firestore,
      Collections.ChangeEnterpriseRequests,
    );
    try {
      const q = query(
        collectionConnection,
        where("active", "==", true),
        where("userId", "==", userId),
        where("serviceType", "==", vehicleType),
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size > 0;
    } catch (error) {
      console.error("Error counting active requests:", error);
      return false;
    }
  };
}
