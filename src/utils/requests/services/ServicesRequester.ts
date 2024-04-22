import { UserRequest } from "@/interfaces/UserRequest";
import {
    CollectionReference,
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
    startAfter,
    where,
} from "firebase/firestore";
import { driveReqCollection } from "./DriveRequester";
import { mechanicReqCollection } from "./MechanicRequester";
import { towReqCollection } from "./TowRequester";

export const MIN_NUM_OF_APPROVALS = 1;

export const getPaginatedData = async (
    direction: "next" | "prev" | undefined,
    collection: CollectionReference,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot,
    numPerPage: number = 10,
) => {
    let dataQuery = query(
        collection,
        orderBy("active"),
        limit(numPerPage),
        where("aproved", "==", false),
        where("active", "==", true),
    );

    if (direction === "next" && startAfterDoc) {
        dataQuery = query(dataQuery, startAfter(startAfterDoc));
    } else if (direction === "prev" && endBeforeDoc) {
        dataQuery = query(
            collection,
            orderBy("active"),
            endBefore(endBeforeDoc),
            limitToLast(numPerPage),
            where("aproved", "==", false),
            where("active", "==", true),
        );
    }

    const reqsSnapshot = await getDocs(dataQuery);
    const reqs = reqsSnapshot.docs.map((doc) => doc.data());

    return {
        result: reqs as UserRequest[],
        lastDoc: reqsSnapshot.docs[reqsSnapshot.docs.length - 1],
        firstDoc: reqsSnapshot.docs[0],
    };
};

export const getNumPages = async (
    numPerPages: number,
    collection: CollectionReference,
): Promise<number> => {
    const count = await getCountFromServer(
        query(collection, where("aproved", "==", false), where("active", "==", true)),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};

export const getServiceReqById = async (
    id: string,
    collection: CollectionReference,
): Promise<UserRequest | undefined> => {
    try {
        const reqDoc = await getDoc(doc(collection, id));
        if (reqDoc.exists()) {
            return reqDoc.data() as UserRequest;
        }
        return undefined;
    } catch (error) {
        throw error;
    }
};

export const numOfApprovals = (req: UserRequest): number => {
    var approvals = 0;
    req.reviewedByHistory?.forEach((history) => {
        if (history.aproved) {
            approvals++;
        }
    });

    return approvals;
};

export const getServiceCollection = (type: "driver" | "mechanic" | "tow") => {
    return type === "driver"
        ? driveReqCollection
        : type === "mechanic"
        ? mechanicReqCollection
        : towReqCollection;
};
