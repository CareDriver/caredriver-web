import {
  DocumentData,
  onSnapshot,
  Query,
  Unsubscribe,
} from "firebase/firestore";

export interface RealTimeResponse<T> {
  onFound: (doc: T) => void;
  onNotFound: () => void;
}

export async function getDocInRealTime<T>(
  q: Query<DocumentData, DocumentData>,
  behavior: RealTimeResponse<T>,
): Promise<Unsubscribe> {
  try {
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        behavior.onFound(doc.data() as T);
      } else {
        behavior.onNotFound();
      }
    });

    return unsubscribe;
  } catch (error) {
    throw error;
  }
}
