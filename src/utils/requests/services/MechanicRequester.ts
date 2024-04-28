import { firestore } from "@/firebase/FirebaseConfig";
import { collection, doc, DocumentReference, setDoc } from "firebase/firestore";
import { UserRequest } from "@/interfaces/UserRequest";

export const mechanicReqCollection = collection(firestore, "mechanic-requests");

export const saveMechanicReq = async (
    id: string,
    request: UserRequest,
): Promise<DocumentReference> => {
    try {
        const mechanicReqRef = doc(mechanicReqCollection, id);
        await setDoc(mechanicReqRef, request);
        return mechanicReqRef;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
