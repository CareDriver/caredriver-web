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
    updateDoc,
    where,
} from "firebase/firestore";
import { driveReqCollection } from "./DriveRequester";
import { mechanicReqCollection } from "./MechanicRequester";
import { towReqCollection } from "./TowRequester";
import { deleteFile } from "../FileUploader";
import { toast } from "react-toastify";
import { UserInterface } from "@/interfaces/UserInterface";

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

export const deleteImages = async (serviceReq: UserRequest) => {
    try {
        if (typeof serviceReq.newProfilePhotoImgUrl !== "string") {
            await deleteFile(serviceReq.newProfilePhotoImgUrl.ref);
        }
        await deleteFile(serviceReq.realTimePhotoImgUrl.ref);
        // Remove vehicle licenses
        /*         if (serviceReq.vehicles) {
            serviceReq.vehicles.forEach(async (vehicle) => {
                if (vehicle.license.frontImgUrl) {
                    await deleteFile(vehicle.license.frontImgUrl?.ref);
                }
                if (vehicle.license.backImgUrl) {
                    await deleteFile(vehicle.license.backImgUrl?.ref);
                }
            });
        } */
    } catch (e) {
        console.log(e);
    }
};

export const deleteImagesIfLimitOfApproves = async (serviceReq: UserRequest) => {
    if (
        serviceReq.reviewedByHistory &&
        serviceReq.reviewedByHistory?.length + 1 === MIN_NUM_OF_APPROVALS
    ) {
        try {
            await toast.promise(deleteImages(serviceReq), {
                pending: "Eliminando imagenes, por favor espera",
                success: "Images eliminadas",
                error: "Error al eliminar imagenes, intentalo de nuevo por favor",
            });
        } catch (e) {
            console.log(e);
        }
    }
};

export const updateService = async (
    id: string,
    newData: Partial<UserRequest>,
    collection: CollectionReference,
): Promise<void> => {
    try {
        const userRef = doc(collection, id);
        await updateDoc(userRef, newData);
    } catch (error) {
        throw error;
    }
};

export const setFirstService = (
    user: UserInterface,
    current: Partial<UserInterface>,
): Partial<UserInterface> => {
    if (user.services.length === 1) {
        current = {
            ...current,
            balance: {
                currency: "Bs. (BOB)",
                amount: 5,
            },
        };
    }

    return current;
};
