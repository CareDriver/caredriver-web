import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { BrandingRequest } from "@/interfaces/BrandingInterface";
import { collection, doc, DocumentReference, setDoc } from "firebase/firestore";

const brandingCollection = collection(firestore, Collections.BrandingRequests);

export const saveBrandingRequest = async (
    uid: string,
    data: BrandingRequest,
): Promise<DocumentReference> => {
    try {
        const docRef = doc(brandingCollection, uid);
        await setDoc(docRef, data);
        return docRef;
    } catch (error) {
        throw error;
    }
};
