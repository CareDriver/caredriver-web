import { firestore } from "@/firebase/FirebaseConfig";
import { collection, doc, DocumentReference, setDoc } from "firebase/firestore";
import { UserRequest } from "@/interfaces/UserRequest";
import { Collections } from "@/firebase/CollecionNames";

export const laundryReqCollection = collection(firestore, Collections.CarWashRequests);

export const saveLaundryReq = async (
    id: string,
    request: UserRequest,
): Promise<DocumentReference> => {
    try {
        const laundryReqRef = doc(laundryReqCollection, id);
        await setDoc(laundryReqRef, request);
        return laundryReqRef;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
