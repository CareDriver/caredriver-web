import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export const UpPhoto_thereAreActiveReqs = async (userId: string): Promise<boolean> => {
    const collectionConnection = collection(firestore, Collections.ChangePhotoRequests);
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
