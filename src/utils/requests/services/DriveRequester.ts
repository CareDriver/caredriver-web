import { firestore } from "@/firebase/FirebaseConfig";
import { collection, doc, DocumentReference, setDoc } from "firebase/firestore";
import { UserRequest } from "@/interfaces/UserRequest";

export const driveReqCollection = collection(firestore, "driver-requests");

export const saveDriveReq = async (
    id: string,
    request: UserRequest,
): Promise<DocumentReference> => {
    try {
        const driveReqRef = doc(driveReqCollection, id);
        await setDoc(driveReqRef, request);
        return driveReqRef;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
