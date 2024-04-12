import { firestore } from "../../firebase/FirebaseConfig";
import {
    collection,
    addDoc,
    DocumentReference,
    getDoc,
    doc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { Collections } from "@/firebase/CollecionNames";
import { Enterprise } from "@/interfaces/Enterprise";

const enterpriseCollection = collection(firestore, Collections.Enterprises);

export const sendEnterpriseReq = async (
    id: string,
    enterpriseReq: Enterprise,
): Promise<void> => {
    try {
        const enterpriseRef = doc(enterpriseCollection, id);
        await setDoc(enterpriseRef, enterpriseReq);
    } catch (error) {
        throw error;
    }
};

export const aproveEnterpriseReq = async (
    enterPriseId: string,
    adminId: string,
): Promise<void> => {
    var newData: Partial<Enterprise> = {
        aproved: true,
        aprovedBy: adminId,
    };
    try {
        const userRef = doc(enterpriseCollection, enterPriseId);
        await updateDoc(userRef, newData);
    } catch (error) {
        throw error;
    }
};
