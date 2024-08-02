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
            var data = enterpriseDoc.data() as Enterprise;
            data.id = id;
            return data;
        }
        return undefined;
    } catch (error) {
        throw error;
    }
};

// PAGINATE ENTERPRISE DATA JUST FOR A USER

export const getPaginatedData = async (
    type: "mechanical" | "tow" | "laundry" | "driver",
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
    const products = productsSnapshot.docs.map((doc) => {
        var data = doc.data() as Enterprise;
        data.id = doc.id;
        return data;
    });

    return {
        result: products,
        lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1],
        firstDoc: productsSnapshot.docs[0],
    };
};

export const getNumPages = async (
    numPerPages: number,
    type: "mechanical" | "tow" | "laundry" | "driver",
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

const isSupportInEnteprise = (userId: string, enterprise: Enterprise): boolean => {
    if (enterprise.addedUsers) {
        return enterprise.addedUsers.some(
            (u) => u.userId === userId && u.role === "support",
        );
    }
    return false;
};

export const getUserEnterprises = async (
    type: "mechanical" | "tow" | "laundry" | "driver",
    userId: string,
) => {
    let dataQuery = query(
        enterpriseCollection,
        orderBy("name"),
        where("userId", "==", userId),
        where("aproved", "==", true),
        where("deleted", "==", false),
        where("type", "==", type),
    );
    const productsSnapshot = await getDocs(dataQuery);
    const products = productsSnapshot.docs.map((doc) => {
        var data = doc.data() as Enterprise;
        data.id = doc.id;
        return data;
    });

    return products;
};

// PAGINATE TO GET ENTERPRISES FOR USERS THAT ARE SUPPORT FOR THEIR
export const getPaginatedDataForSupportUsers = async (
    type: "mechanical" | "tow" | "laundry" | "driver",
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
        where("addedUsersId", "array-contains", userId),
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
            where("addedUsersId", "array-contains", userId),
            where("aproved", "==", true),
            where("deleted", "==", false),
            where("type", "==", type),
        );
    }

    const productsSnapshot = await getDocs(dataQuery);
    let products = productsSnapshot.docs.map((doc) => {
        var data = doc.data() as Enterprise;
        data.id = doc.id;
        return data;
    });
    products = products.filter((p) => isSupportInEnteprise(userId, p));

    return {
        result: products,
        lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1],
        firstDoc: productsSnapshot.docs[0],
    };
};

export const getNumPagesForSupportUsers = async (
    numPerPages: number,
    type: "mechanical" | "tow" | "laundry" | "driver",
    userId: string,
): Promise<number> => {
    const count = await getCountFromServer(
        query(
            enterpriseCollection,
            where("addedUsersId", "array-contains", userId),
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
    location: string,
    type: "mechanical" | "tow" | "laundry" | "driver",
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
        where("location", "==", location),
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
            where("location", "==", location),
        );
    }

    const productsSnapshot = await getDocs(dataQuery);
    const products = productsSnapshot.docs.map((doc) => {
        var data = doc.data() as Enterprise;
        data.id = doc.id;
        return data;
    });

    return {
        result: products,
        lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1],
        firstDoc: productsSnapshot.docs[0],
    };
};

export const getAllNumPages = async (
    location: string,
    numPerPages: number,
    type: "mechanical" | "tow" | "laundry" | "driver",
): Promise<number> => {
    const count = await getCountFromServer(
        query(
            enterpriseCollection,
            where("aproved", "==", true),
            where("deleted", "==", false),
            where("active", "==", true),
            where("type", "==", type),
            where("location", "==", location),
        ),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};

// PAGINATE ENTERPRISE REQS

export const getEnterpriseReqs = async (
    type: "mechanical" | "tow" | "laundry" | "driver",
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
    const products = productsSnapshot.docs.map((doc) => {
        var data = doc.data() as Enterprise;
        data.id = doc.id;
        return data;
    });

    return {
        result: products,
        lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1],
        firstDoc: productsSnapshot.docs[0],
    };
};

export const getEnterpriseReqsNumPages = async (
    numPerPages: number,
    type: "mechanical" | "tow" | "laundry" | "driver",
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

// PAGINATE ENTERPRISE DATA FOR ALL USERS, USED FOR MECHANIC AND TOW REQS

export const getEnterprisesAdminPaginated = async (
    type: "mechanical" | "tow" | "laundry" | "driver",
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
            where("type", "==", type),
        );
    }

    const productsSnapshot = await getDocs(dataQuery);
    const products = productsSnapshot.docs.map((doc) => {
        var data = doc.data() as Enterprise;
        data.id = doc.id;
        return data;
    });

    return {
        result: products,
        lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1],
        firstDoc: productsSnapshot.docs[0],
    };
};

export const getEnterprisesAdminNumPages = async (
    numPerPages: number,
    type: "mechanical" | "tow" | "laundry" | "driver",
): Promise<number> => {
    const count = await getCountFromServer(
        query(
            enterpriseCollection,
            where("aproved", "==", true),
            where("deleted", "==", false),
            where("type", "==", type),
        ),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};
