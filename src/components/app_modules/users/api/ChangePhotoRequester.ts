import { firestore } from "../../../../firebase/FirebaseConfig";
import {
  collection,
  DocumentReference,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  DocumentSnapshot,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  endBefore,
  getDocs,
  getCountFromServer,
  Unsubscribe,
} from "firebase/firestore";
import { Collections } from "@/firebase/CollecionNames";
import { ChangePhotoReqInterface } from "@/interfaces/ChangePhotoReq";
import {
  getDocInRealTime,
  RealTimeResponse,
} from "@/utils/requesters/RealTimeFetcher";

const changePhotoReqCollection = collection(
  firestore,
  Collections.ChangePhotoRequests,
);

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

export const getUpPhotoReqById = async (
  reqId: string,
  behavior: RealTimeResponse<ChangePhotoReqInterface>,
): Promise<Unsubscribe> => {
  const q = query(changePhotoReqCollection, where("id", "==", reqId));
  return await getDocInRealTime<ChangePhotoReqInterface>(q, behavior);
};

export const updateUpPhotoReq = async (
  id: string,
  newData: Partial<ChangePhotoReqInterface>,
): Promise<void> => {
  try {
    const ref = doc(changePhotoReqCollection, id);
    await updateDoc(ref, newData);
  } catch (error) {
    throw error;
  }
};

export const deleteChangePhotoReq = async (id: string) => {
  await updateUpPhotoReq(id, {
    active: false,
  });
};

export const getChangePhotoReqPaginated = async (
  direction: "next" | "prev" | undefined,
  startAfterDoc?: DocumentSnapshot,
  endBeforeDoc?: DocumentSnapshot,
  numPerPage: number = 8,
) => {
  let dataQuery = query(
    changePhotoReqCollection,
    orderBy("userName"),
    limit(numPerPage),
    where("active", "==", true),
  );

  if (direction === "next" && startAfterDoc) {
    dataQuery = query(dataQuery, startAfter(startAfterDoc));
  } else if (direction === "prev" && endBeforeDoc) {
    dataQuery = query(
      changePhotoReqCollection,
      orderBy("userName"),
      endBefore(endBeforeDoc),
      limit(numPerPage),
      where("active", "==", true),
    );
  }

  const productsSnapshot = await getDocs(dataQuery);
  const products = productsSnapshot.docs.map((doc) => {
    var reqPhoto = doc.data() as ChangePhotoReqInterface;
    reqPhoto.id = doc.id;
    return reqPhoto;
  });

  return {
    result: products,
    lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1],
    firstDoc: productsSnapshot.docs[0],
  };
};

export const getChangePhotoReqNumPages = async (
  numPerPages: number,
): Promise<number> => {
  const count = await getCountFromServer(
    query(changePhotoReqCollection, where("active", "==", true)),
  );
  const numPages = Math.ceil(count.data().count / numPerPages);
  return numPages;
};
