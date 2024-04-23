import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { ReqEditEnterprise } from "@/interfaces/Enterprise";
import { collection, doc, setDoc } from "firebase/firestore";

const EditEnterpriseCollection = collection(firestore, Collections.EditEnterprises);

export const sendEditEnterpriseReq = async (
    id: string,
    enterpriseReq: ReqEditEnterprise,
): Promise<void> => {
    try {
        const enterpriseRef = doc(EditEnterpriseCollection, id);
        await setDoc(enterpriseRef, enterpriseReq);
    } catch (error) {
        throw error;
    }
};
