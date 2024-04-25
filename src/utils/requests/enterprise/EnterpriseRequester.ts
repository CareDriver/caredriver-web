import { firestore } from "../../../firebase/FirebaseConfig";
import {
    collection,
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

export const deleteEnterpriseReq = async (id: string): Promise<void> => {
    var newData: Partial<Enterprise> = {
        deleted: true,
    };
    await updateEnterprise(id, newData);
};

export const disableEnterprise = async (id: string): Promise<void> => {
    var newData: Partial<Enterprise> = {
        active: false,
    };
    await updateEnterprise(id, newData);
};

export const enableEnterprise = async (id: string): Promise<void> => {
    var newData: Partial<Enterprise> = {
        active: true,
    };
    await updateEnterprise(id, newData);
};

export const aproveEnterpriseReq = async (
    enterPriseId: string,
    adminId: string,
): Promise<void> => {
    var newData: Partial<Enterprise> = {
        aproved: true,
        aprovedBy: adminId,
    };
    await updateEnterprise(enterPriseId, newData);
};

export const declineEnterpriseReq = async (
    enterprise: Enterprise,
    adminId: string,
): Promise<void> => {
    if (enterprise.id) {
        var newData: Partial<Enterprise> = {
            logoImgUrl: {
                ref: "deleted",
                url: "",
            },
            aproved: false,
            aprovedBy: adminId,
            deleted: true,
            active: false,
        };
        await updateEnterprise(enterprise.id, newData);
    }
};

export const updateEnterprise = async (
    id: string,
    newData: Partial<Enterprise>,
): Promise<void> => {
    try {
        const enterpriseRef = doc(enterpriseCollection, id);
        await updateDoc(enterpriseRef, newData);
    } catch (error) {
        throw error;
    }
};

export const getEnterpriseById = async (id: string): Promise<Enterprise | undefined> => {
    try {
        const enterpriseDoc = await getDoc(doc(enterpriseCollection, id));
        if (enterpriseDoc.exists()) {
            return enterpriseDoc.data() as Enterprise;
        }
        return undefined;
    } catch (error) {
        throw error;
    }
};

// PAGINATE ENTERPRISE DATA JUST FOR A USER

export const getPaginatedData = async (
    type: string,
    userId: string,
    direction: "next" | "prev" | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot,
    numPerPage: number = 12,
) => {
    let dataQuery = query(
        enterpriseCollection,
        orderBy("name"),
        limit(numPerPage),
        where("userId", "==", userId),
        where("aproved", "==", true),
        where("deleted", "==", false),
        where("type", "==", type),
    );

    if (direction === "next" && startAfterDoc) {
        dataQuery = query(dataQuery, startAfter(startAfterDoc));
    } else if (direction === "prev" && endBeforeDoc) {
        dataQuery = query(
            enterpriseCollection,
            orderBy("name"),
            endBefore(endBeforeDoc),
            limitToLast(numPerPage),
            where("userId", "==", userId),
            where("aproved", "==", true),
            where("deleted", "==", false),
            where("type", "==", type),
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

export const getNumPages = async (
    numPerPages: number,
    type: string,
    userId: string,
): Promise<number> => {
    const count = await getCountFromServer(
        query(
            enterpriseCollection,
            where("userId", "==", userId),
            where("aproved", "==", true),
            where("deleted", "==", false),
            where("type", "==", type),
        ),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};

// PAGINATE ENTERPRISE DATA FOR ALL USERS, USED FOR MECHANIC AND TOW REQS

export const getAllPaginatedData = async (
    type: string,
    direction: "next" | "prev" | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot,
    numPerPage: number = 8,
) => {
    let dataQuery = query(
        enterpriseCollection,
        orderBy("name"),
        limit(numPerPage),
        where("aproved", "==", true),
        where("deleted", "==", false),
        where("active", "==", true),
        where("type", "==", type),
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
            where("deleted", "==", false),
            where("active", "==", true),
            where("type", "==", type),
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

export const getAllNumPages = async (
    numPerPages: number,
    type: string,
): Promise<number> => {
    const count = await getCountFromServer(
        query(
            enterpriseCollection,
            where("aproved", "==", true),
            where("deleted", "==", false),
            where("active", "==", true),
            where("type", "==", type),
        ),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};

// PAGINATE ENTERPRISE REQS

export const getEnterpriseReqs = async (
    type: string,
    direction: "next" | "prev" | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot,
    numPerPage: number = 12,
) => {
    let dataQuery = query(
        enterpriseCollection,
        orderBy("name"),
        limit(numPerPage),
        where("aproved", "==", false),
        where("deleted", "==", false),
        where("active", "==", true),
        where("type", "==", type),
    );

    if (direction === "next" && startAfterDoc) {
        dataQuery = query(dataQuery, startAfter(startAfterDoc));
    } else if (direction === "prev" && endBeforeDoc) {
        dataQuery = query(
            enterpriseCollection,
            orderBy("name"),
            endBefore(endBeforeDoc),
            limitToLast(numPerPage),
            where("aproved", "==", false),
            where("deleted", "==", false),
            where("active", "==", true),
            where("type", "==", type),
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

export const getEnterpriseReqsNumPages = async (
    numPerPages: number,
    type: string,
): Promise<number> => {
    const count = await getCountFromServer(
        query(
            enterpriseCollection,
            where("aproved", "==", false),
            where("deleted", "==", false),
            where("active", "==", true),
            where("type", "==", type),
        ),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};
