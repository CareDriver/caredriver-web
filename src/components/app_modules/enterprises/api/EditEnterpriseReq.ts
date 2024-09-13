import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { ReqEditEnterprise } from "@/interfaces/Enterprise";
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

const EditEnterpriseCollection = collection(
    firestore,
    Collections.EditEnterprises,
);

export const sendEditEnterpriseReq = async (
    id: string,
    enterpriseReq: ReqEditEnterprise,
): Promise<void> => {
    try {
        const enterpriseRef = doc(EditEnterpriseCollection, id);
        await setDoc(enterpriseRef, enterpriseReq);
    } catch (error) {
        throw error;
    }
};

export const getReqToEditEnterpriseInRealTime = async (
    id: string,
    behavior: RealTimeResponse<ReqEditEnterprise>,
): Promise<Unsubscribe> => {
    const q = query(EditEnterpriseCollection, where("id", "==", id));
    return await getDocInRealTime<ReqEditEnterprise>(q, behavior);
};

export const updateUpdateEnterprise = async (
    id: string,
    newData: Partial<ReqEditEnterprise>,
): Promise<void> => {
    try {
        const enterpriseRef = doc(EditEnterpriseCollection, id);
        await updateDoc(enterpriseRef, newData);
    } catch (error) {
        throw error;
    }
};

export const getEditEnterpriseReqs = async (
    type: string,
    direction: "next" | "prev" | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot,
    numPerPage: number = 12,
) => {
    let dataQuery = query(
        EditEnterpriseCollection,
        orderBy("name"),
        limit(numPerPage),
        where("active", "==", true),
        where("type", "==", type),
    );

    if (direction === "next" && startAfterDoc) {
        dataQuery = query(dataQuery, startAfter(startAfterDoc));
    } else if (direction === "prev" && endBeforeDoc) {
        dataQuery = query(
            EditEnterpriseCollection,
            orderBy("name"),
            endBefore(endBeforeDoc),
            limitToLast(numPerPage),
            where("active", "==", true),
            where("type", "==", type),
        );
    }

    const productsSnapshot = await getDocs(dataQuery);
    const products = productsSnapshot.docs.map((doc) => {
        var data = doc.data() as ReqEditEnterprise;
        data.id = doc.id;
        return data;
    });

    return {
        result: products as ReqEditEnterprise[],
        lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1],
        firstDoc: productsSnapshot.docs[0],
    };
};

export const getEditEnterpriseReqsNumPages = async (
    numPerPages: number,
    type: string,
): Promise<number> => {
    const count = await getCountFromServer(
        query(
            EditEnterpriseCollection,
            where("active", "==", true),
            where("type", "==", type),
        ),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};
