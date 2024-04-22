import { firestore } from "@/firebase/FirebaseConfig";
import { collection, doc, DocumentReference, setDoc } from "firebase/firestore";
import { UserRequest } from "@/interfaces/UserRequest";
import { Collections } from "@/firebase/CollecionNames";

export const towReqCollection = collection(firestore, Collections.TowRequests);

export const saveTowReq = async (
    id: string,
    request: UserRequest,
): Promise<DocumentReference> => {
    try {
        const towReqRef = doc(towReqCollection, id);
        await setDoc(towReqRef, request);
        return towReqRef;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
