import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { RequestForChangeOfEnterprise } from "@/interfaces/RequestForChangeOfEnterprise";
import { ServiceType } from "@/interfaces/Services";
import {
    getDocInRealTime,
    RealTimeResponse,
} from "@/utils/requesters/RealTimeFetcher";
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
    Unsubscribe,
    updateDoc,
    where,
} from "firebase/firestore";

const COLLECTION = collection(firestore, Collections.ChangeEnterpriseRequests);

export const sendRequestToChangeAssociatedEnterprise = async (
    id: string,
    req: RequestForChangeOfEnterprise,
): Promise<void> => {
    try {
        const reqRef = doc(COLLECTION, id);
        await setDoc(reqRef, req);
    } catch (error) {
        throw error;
    }
};

export const getRequestToChangeAssociatedEnterpriseById = async (
    reqId: string,
    behavior: RealTimeResponse<RequestForChangeOfEnterprise>,
): Promise<Unsubscribe> => {
    const q = query(COLLECTION, where("id", "==", reqId));
    return await getDocInRealTime<RequestForChangeOfEnterprise>(q, behavior);
};

export const updateRequestToChangeAssociatedEnterprise = async (
    id: string,
    newData: Partial<RequestForChangeOfEnterprise>,
): Promise<void> => {
    try {
        const ref = doc(COLLECTION, id);
        await updateDoc(ref, newData);
    } catch (error) {
        throw error;
    }
};

export const getRequestsToChangeEntepriseByPagination = async (
    direction: "next" | "prev" | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot,
    numPerPage: number = 8,
) => {
    let dataQuery = query(
        COLLECTION,
        orderBy("serviceType"),
        limit(numPerPage),
        where("active", "==", true),
    );

    if (direction === "next" && startAfterDoc) {
        dataQuery = query(dataQuery, startAfter(startAfterDoc));
    } else if (direction === "prev" && endBeforeDoc) {
        dataQuery = query(
            COLLECTION,
            orderBy("serviceType"),
            endBefore(endBeforeDoc),
            limitToLast(numPerPage),
            where("active", "==", true),
        );
    }

    const productsSnapshot = await getDocs(dataQuery);
    const products = productsSnapshot.docs.map((doc) => {
        var license = doc.data() as RequestForChangeOfEnterprise;
        license.id = doc.id;
        return license;
    });

    return {
        result: products,
        lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1],
        firstDoc: productsSnapshot.docs[0],
    };
};

export const countPagesOfRequestsToChangeEnterprise = async (
    numPerPages: number,
): Promise<number> => {
    const count = await getCountFromServer(
        query(COLLECTION, where("active", "==", true)),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};
