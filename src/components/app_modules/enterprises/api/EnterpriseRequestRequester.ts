import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { EnterpriseRequest } from "@/interfaces/Enterprise";
import { ServiceType } from "@/interfaces/Services";
import {
  collection,
  doc,
  DocumentSnapshot,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";

export const enterpriseRequestCollection = collection(
  firestore,
  Collections.EnterpriseRequests,
);

export const saveEnterpriseRequest = async (
  id: string,
  request: EnterpriseRequest,
): Promise<void> => {
  const ref = doc(enterpriseRequestCollection, id);
  await setDoc(ref, request);
};

export const getEnterpriseRequestById = async (
  id: string,
): Promise<EnterpriseRequest | undefined> => {
  const snap = await getDoc(doc(enterpriseRequestCollection, id));
  if (snap.exists()) {
    const data = snap.data() as EnterpriseRequest;
    data.id = id;
    return data;
  }
  return undefined;
};

export const updateEnterpriseRequest = async (
  id: string,
  data: Partial<EnterpriseRequest>,
): Promise<void> => {
  const ref = doc(enterpriseRequestCollection, id);
  await updateDoc(ref, data);
};

// Paginated enterprise requests for admin review
export const getEnterpriseRequestsPaginated = async (
  type: ServiceType,
  direction: "next" | "prev" | undefined,
  startAfterDoc?: DocumentSnapshot,
  endBeforeDoc?: DocumentSnapshot,
  numPerPage: number = 12,
) => {
  let dataQuery = query(
    enterpriseRequestCollection,
    orderBy("createdAt", "desc"),
    limit(numPerPage),
    where("active", "==", true),
    where("deleted", "==", false),
    where("type", "==", type),
  );

  if (direction === "next" && startAfterDoc) {
    dataQuery = query(dataQuery, startAfter(startAfterDoc));
  } else if (direction === "prev" && endBeforeDoc) {
    dataQuery = query(
      enterpriseRequestCollection,
      orderBy("createdAt", "desc"),
      endBefore(endBeforeDoc),
      limitToLast(numPerPage),
      where("active", "==", true),
      where("deleted", "==", false),
      where("type", "==", type),
    );
  }

  const snap = await getDocs(dataQuery);
  const results = snap.docs.map((d) => {
    const data = d.data() as EnterpriseRequest;
    data.id = d.id;
    return data;
  });

  return {
    result: results,
    lastDoc: snap.docs[snap.docs.length - 1],
    firstDoc: snap.docs[0],
  };
};

export const getEnterpriseRequestsNumPages = async (
  numPerPage: number,
  type: ServiceType,
): Promise<number> => {
  const count = await getCountFromServer(
    query(
      enterpriseRequestCollection,
      where("active", "==", true),
      where("deleted", "==", false),
      where("type", "==", type),
    ),
  );
  return Math.ceil(count.data().count / numPerPage);
};

// Get all active enterprise requests (all types) for admin overview
export const getAllActiveEnterpriseRequests = async (
  direction: "next" | "prev" | undefined,
  startAfterDoc?: DocumentSnapshot,
  endBeforeDoc?: DocumentSnapshot,
  numPerPage: number = 12,
) => {
  let dataQuery = query(
    enterpriseRequestCollection,
    orderBy("createdAt", "desc"),
    limit(numPerPage),
    where("active", "==", true),
    where("deleted", "==", false),
  );

  if (direction === "next" && startAfterDoc) {
    dataQuery = query(dataQuery, startAfter(startAfterDoc));
  } else if (direction === "prev" && endBeforeDoc) {
    dataQuery = query(
      enterpriseRequestCollection,
      orderBy("createdAt", "desc"),
      endBefore(endBeforeDoc),
      limitToLast(numPerPage),
      where("active", "==", true),
      where("deleted", "==", false),
    );
  }

  const snap = await getDocs(dataQuery);
  const results = snap.docs.map((d) => {
    const data = d.data() as EnterpriseRequest;
    data.id = d.id;
    return data;
  });

  return {
    result: results,
    lastDoc: snap.docs[snap.docs.length - 1],
    firstDoc: snap.docs[0],
  };
};

export const getAllActiveEnterpriseRequestsNumPages = async (
  numPerPage: number,
): Promise<number> => {
  const count = await getCountFromServer(
    query(
      enterpriseRequestCollection,
      where("active", "==", true),
      where("deleted", "==", false),
    ),
  );
  return Math.ceil(count.data().count / numPerPage);
};
