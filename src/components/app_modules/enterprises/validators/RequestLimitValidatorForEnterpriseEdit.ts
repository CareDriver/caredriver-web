import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

const COLLECTION = collection(firestore, Collections.EditEnterprises);

export class RequestLimitValidatorForEnterpriseEdit {
    validate = async (
        userId: string,
        enterpriseId: string,
        typeOfEnterprise: "mechanical" | "tow" | "laundry" | "driver",
    ): Promise<boolean> => {
        try {
            const q = query(
                COLLECTION,
                where("type", "==", typeOfEnterprise),
                where("active", "==", true),
                where("enterpriseId", "==", enterpriseId),
                where("userId", "==", userId),
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.size > 0;
        } catch (error) {
            return false;
        }
    };
}
