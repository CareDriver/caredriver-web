import { firestore } from "../../firebase/FirebaseConfig";
import {
    collection,
    addDoc,
    DocumentReference,
    getDoc,
    doc,
    setDoc,
    updateDoc,
    query,
    orderBy,
    limit,
    DocumentSnapshot,
    startAfter,
    endBefore,
    limitToLast,
    getDocs,
    getCountFromServer,
    where,
} from "firebase/firestore";
import { Collections } from "@/firebase/CollecionNames";
import { Enterprise } from "@/interfaces/Enterprise";

const enterpriseCollection = collection(firestore, Collections.Enterprises);

export const sendEnterpriseReq = async (
    id: string,
    enterpriseReq: Enterprise,
): Promise<void> => {
    try {
        const enterpriseRef = doc(enterpriseCollection, id);
        await setDoc(enterpriseRef, enterpriseReq);
    } catch (error) {
        throw error;
    }
};

export const aproveEnterpriseReq = async (
    enterPriseId: string,
    adminId: string,
): Promise<void> => {
    var newData: Partial<Enterprise> = {
        aproved: true,
        aprovedBy: adminId,
    };
    try {
        const userRef = doc(enterpriseCollection, enterPriseId);
        await updateDoc(userRef, newData);
    } catch (error) {
        throw error;
    }
};

export const getPaginatedData = async (
    direction: "next" | "prev" | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot,
    numPerPage: number = 12,
) => {
    let dataQuery = query(
        enterpriseCollection,
        orderBy("name"),
        limit(numPerPage),
        where("aproved", "==", true),
        where("type", "==", "tow"),
    );

    if (direction === "next" && startAfterDoc) {
        dataQuery = query(dataQuery, startAfter(startAfterDoc));
    } else if (direction === "prev" && endBeforeDoc) {
        dataQuery = query(
            enterpriseCollection,
            orderBy("name"),
            endBefore(endBeforeDoc),
            limitToLast(numPerPage),
            where("aproved", "==", true),
            where("type", "==", "tow"),
        );
    }

    const productsSnapshot = await getDocs(dataQuery);
    const products = productsSnapshot.docs.map((doc) => doc.data());

    return {
        result: products as Enterprise[],
        lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1],
        firstDoc: productsSnapshot.docs[0],
    };
};

export const getNumPages = async (numPerPages: number): Promise<number> => {
    const count = await getCountFromServer(
        query(
            enterpriseCollection,
            where("aproved", "==", true),
            where("type", "==", "tow"),
        ),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};
