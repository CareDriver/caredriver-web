import { firestore } from "../../firebase/FirebaseConfig";
import { collection, DocumentReference, doc, setDoc } from "firebase/firestore";
import { Collections } from "@/firebase/CollecionNames";
import { ChangePhotoReqInterface } from "@/interfaces/ChangePhotoReq";

const changePhotoReqCollection = collection(firestore, Collections.ChangePhotoRequests);

/**
 * Saves a user to the database.
 *
 * @param {string} uid - The unique identifier of the user.
 * @param {Omit<UserInterface, 'id'>} userData - The data of the user to be saved.
 * @returns {Promise<DocumentReference>} A promise that resolves to the reference of the saved user document.
 * @throws {Error} If there is an error adding the user.
 */
export const saveChangePhotoReq = async (
    uid: string,
    req: ChangePhotoReqInterface,
): Promise<DocumentReference> => {
    try {
        const reqRef = doc(changePhotoReqCollection, uid);
        await setDoc(reqRef, req);
        return reqRef;
    } catch (error) {
        throw error;
    }
};
