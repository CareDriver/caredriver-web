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

const driveRequestedServicesColl = collection(firestore, Collections.DriverServices);
const mechanicRequestedServicesColl = collection(
    firestore,
    Collections.MechanicalServices,
);
const towRequestedServicesColl = collection(firestore, Collections.TowsServices);
const laundryRequestedServicesColl = collection(firestore, Collections.CarWashServices);

export const getServiceRequestedCollection = (
    type: "driver" | "mechanic" | "tow" | "laundry",
) => {
    switch (type) {
        case "driver":
            return driveRequestedServicesColl;
        case "mechanic":
            return mechanicRequestedServicesColl;
        case "tow":
            return towRequestedServicesColl;
        default:
            return laundryRequestedServicesColl;
    }
};

export const getServicerRequestedByFakeId = async(id: string,
    collection: CollectionReference,) => {

}

export const getServicerRequestedById = async (
    id: string,
    collection: CollectionReference,
): Promise<ServiceRequestInterface | undefined> => {
    try {
        const reqDoc = await getDoc(doc(collection, id));
        if (reqDoc.exists()) {
            var data = reqDoc.data() as ServiceRequestInterface;
            data.id = id;
            return data;
        }
        return undefined;
    } catch (error) {
        throw error;
    }
};

// ALL DATA

export const getServicesRequestedPaginated = async (
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
        where("userId", "==", userId),
    );

    if (direction === "next" && startAfterDoc) {
        dataQuery = query(dataQuery, startAfter(startAfterDoc));
    }

    const reqsSnapshot = await getDocs(dataQuery);
    const reqs = reqsSnapshot.docs.map((doc) => {
        var serviceDone = doc.data() as ServiceRequestInterface;
        serviceDone.id = doc.id;
        return serviceDone;
    });

    return {
        result: reqs,
        lastDoc: reqsSnapshot.docs[reqsSnapshot.docs.length - 1],
        firstDoc: reqsSnapshot.docs[0],
    };
};

export const getServicesRequestedNumPages = async (
    userId: string,
    numPerPages: number,
    collection: CollectionReference,
): Promise<number> => {
    const count = await getCountFromServer(
        query(collection, where("userId", "==", userId)),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};

// FILTER DATA BY DATE

export const getServicesRequestedFilterPaginated = async (
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
        where("userId", "==", userId),
        where("createdAt", "<=", tillDate),
    );

    if (direction === "next" && startAfterDoc) {
        dataQuery = query(dataQuery, startAfter(startAfterDoc));
    }

    const reqsSnapshot = await getDocs(dataQuery);
    const reqs = reqsSnapshot.docs.map((doc) => {
        var serviceDone = doc.data() as ServiceRequestInterface;
        serviceDone.id = doc.id;
        return serviceDone;
    });

    return {
        result: reqs,
        lastDoc: reqsSnapshot.docs[reqsSnapshot.docs.length - 1],
        firstDoc: reqsSnapshot.docs[0],
    };
};

export const getServicesRequestedFilterNumPages = async (
    userId: string,
    tillDate: Timestamp,
    numPerPages: number,
    collection: CollectionReference,
): Promise<number> => {
    const count = await getCountFromServer(
        query(
            collection,
            where("userId", "==", userId),
            where("createdAt", "<=", tillDate),
        ),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};
