import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { ActionOnUserInterface } from "@/interfaces/ActionOnUserInterface";
import { collection, doc, DocumentReference, setDoc } from "firebase/firestore";

const actionOnUserCollection = collection(firestore, Collections.ActionOnUsers);

export const saveActionOnUser = async (
  uid: string,
  data: ActionOnUserInterface,
): Promise<DocumentReference> => {
  try {
    const docRef = doc(actionOnUserCollection, uid);
    await setDoc(docRef, data);
    return docRef;
  } catch (error) {
    throw error;
  }
};
