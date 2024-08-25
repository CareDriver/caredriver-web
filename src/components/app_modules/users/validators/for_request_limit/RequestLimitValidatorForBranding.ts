import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export class RequestLimitValidatorForBranding {
    hasRequestsSent = async (userId: string): Promise<boolean> => {
        const collectionConnection = collection(
            firestore,
            Collections.BrandingRequests,
        );
        try {
            const q = query(
                collectionConnection,
                where("active", "==", true),
                where("userId", "==", userId),
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.size > 0;
        } catch (error) {
            console.error("Error counting active requests:", error);
            return false;
        }
    };
}
