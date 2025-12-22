import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { BalanceHistoryItem } from "@/interfaces/Payment";
import { collection, doc, DocumentReference, setDoc } from "firebase/firestore";

const usersCollection = collection(firestore, Collections.BalanceHistory);

export const saveBalanceHistoryItem = async (
  uid: string,
  data: BalanceHistoryItem,
): Promise<DocumentReference> => {
  try {
    const userRef = doc(usersCollection, uid);
    await setDoc(userRef, data);
    return userRef;
  } catch (error) {
    throw error;
  }
};
