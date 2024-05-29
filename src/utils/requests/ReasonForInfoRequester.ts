import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { ReasonForInformationInterface } from "@/interfaces/ReasonsForInformation";
import { collection, doc, DocumentReference, setDoc } from "firebase/firestore";

const reasonForInfoCollection = collection(firestore, Collections.ReasonsForInformation);

export const saveReasonForInfo = async (
    uid: string,
    data: ReasonForInformationInterface,
): Promise<DocumentReference> => {
    try {
        const docRef = doc(reasonForInfoCollection, uid);
        await setDoc(docRef, data);
        return docRef;
    } catch (error) {
        throw error;
    }
};
