import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { ServiceRequestInterface } from "@/interfaces/ServiceRequestInterface";
import {
    collection,
    CollectionReference,
    doc,
    DocumentSnapshot,
    getCountFromServer,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    Timestamp,
    where,
} from "firebase/firestore";

const driveDoneServicesColl = collection(firestore, Collections.DriverServices);
const mechanicDoneServicesColl = collection(firestore, Collections.MechanicalServices);
const towDoneServicesColl = collection(firestore, Collections.TowsServices);

export const getServiceDoneCollection = (type: "driver" | "mechanic" | "tow") => {
    return type === "driver"
        ? driveDoneServicesColl
        : type === "mechanic"
        ? mechanicDoneServicesColl
        : towDoneServicesColl;
};

export const getServiceDoneById = async (
    id: string,
    collection: CollectionReference,
): Promise<ServiceRequestInterface | undefined> => {
    try {
        const reqDoc = await getDoc(doc(collection, id));
        if (reqDoc.exists()) {
            return reqDoc.data() as ServiceRequestInterface;
        }
        return undefined;
    } catch (error) {
        throw error;
    }
};

// ALL DATA

export const getServicesDonePaginated = async (
    userId: string,
    direction: "next" | undefined,
    collection: CollectionReference,
    startAfterDoc?: DocumentSnapshot,
    numPerPage: number = 10,
) => {
    let dataQuery = query(
        collection,
        orderBy("createdAt"),
        limit(numPerPage),
        where("serviceUserId", "==", userId),
    );

    if (direction === "next" && startAfterDoc) {
        dataQuery = query(dataQuery, startAfter(startAfterDoc));
    }

    const reqsSnapshot = await getDocs(dataQuery);
    const reqs = reqsSnapshot.docs.map((doc) => doc.data());

    return {
        result: reqs as ServiceRequestInterface[],
        lastDoc: reqsSnapshot.docs[reqsSnapshot.docs.length - 1],
        firstDoc: reqsSnapshot.docs[0],
    };
};

export const getServicesDoneNumPages = async (
    userId: string,
    numPerPages: number,
    collection: CollectionReference,
): Promise<number> => {
    const count = await getCountFromServer(
        query(collection, where("serviceUserId", "==", userId)),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};

// FILTER DATA BY DATE

export const getServicesDoneFilterPaginated = async (
    userId: string,
    tillDate: Timestamp,
    direction: "next" | undefined,
    collection: CollectionReference,
    startAfterDoc?: DocumentSnapshot,
    numPerPage: number = 10,
) => {
    let dataQuery = query(
        collection,
        orderBy("createdAt"),
        limit(numPerPage),
        where("serviceUserId", "==", userId),
        where("createdAt", "<=", tillDate),
    );

    if (direction === "next" && startAfterDoc) {
        dataQuery = query(dataQuery, startAfter(startAfterDoc));
    }

    const reqsSnapshot = await getDocs(dataQuery);
    const reqs = reqsSnapshot.docs.map((doc) => doc.data());

    return {
        result: reqs as ServiceRequestInterface[],
        lastDoc: reqsSnapshot.docs[reqsSnapshot.docs.length - 1],
        firstDoc: reqsSnapshot.docs[0],
    };
};

export const getServicesDoneFilterNumPages = async (
    userId: string,
    tillDate: Timestamp,
    numPerPages: number,
    collection: CollectionReference,
): Promise<number> => {
    const count = await getCountFromServer(
        query(
            collection,
            where("serviceUserId", "==", userId),
            where("createdAt", "<=", tillDate),
        ),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};
