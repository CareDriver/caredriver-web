import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export const EditLICC_thereAreActiveReqs = async (
    userId: string,
    vehicleType: "car" | "motorcycle" | "tow",
): Promise<boolean> => {
    const collectionConnection = collection(firestore, Collections.LicenseUpdateReq);
    try {
        const q = query(
            collectionConnection,
            where("active", "==", true),
            where("userId", "==", userId),
            where("vehicleType", "==", vehicleType),
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.size > 0;
    } catch (error) {
        console.error("Error counting active requests:", error);
        return false;
    }
};
