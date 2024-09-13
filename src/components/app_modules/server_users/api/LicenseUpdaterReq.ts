import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { LicenseUpdateReq } from "@/interfaces/PersonalDocumentsInterface";
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
    getDocs,
    limit,
    limitToLast,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    startAfter,
    Unsubscribe,
    updateDoc,
    where,
} from "firebase/firestore";

const licenseUpdateReqCollection = collection(
    firestore,
    Collections.LicenseUpdateReq,
);

export const sendLicenseUpdateReq = async (
    id: string,
    licenseUpdateReq: LicenseUpdateReq,
): Promise<void> => {
    try {
        const reqRef = doc(licenseUpdateReqCollection, id);
        await setDoc(reqRef, licenseUpdateReq);
    } catch (error) {
        throw error;
    }
};

export const getRenewLicenceReqInRealTime = async (
    id: string,
    behavior: RealTimeResponse<LicenseUpdateReq>,
): Promise<Unsubscribe> => {
    const q = query(licenseUpdateReqCollection, where("id", "==", id));
    return await getDocInRealTime<LicenseUpdateReq>(q, behavior);
};

export const updateLicenseUpReq = async (
    id: string,
    newData: Partial<LicenseUpdateReq>,
): Promise<void> => {
    try {
        const ref = doc(licenseUpdateReqCollection, id);
        await updateDoc(ref, newData);
    } catch (error) {
        throw error;
    }
};

export const setReviewLicenseReq = async (id: string) => {
    await updateLicenseUpReq(id, {
        active: false,
    });
};

export const getLicencesToUpdatePaginated = async (
    direction: "next" | "prev" | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot,
    numPerPage: number = 8,
) => {
    let dataQuery = query(
        licenseUpdateReqCollection,
        orderBy("vehicleType"),
        limit(numPerPage),
        where("active", "==", true),
        where("aproved", "==", false),
    );

    if (direction === "next" && startAfterDoc) {
        dataQuery = query(dataQuery, startAfter(startAfterDoc));
    } else if (direction === "prev" && endBeforeDoc) {
        dataQuery = query(
            licenseUpdateReqCollection,
            orderBy("vehicleType"),
            endBefore(endBeforeDoc),
            limitToLast(numPerPage),
            where("active", "==", true),
            where("aproved", "==", false),
        );
    }

    const productsSnapshot = await getDocs(dataQuery);
    const products = productsSnapshot.docs.map((doc) => {
        var license = doc.data() as LicenseUpdateReq;
        license.id = doc.id;
        return license;
    });

    return {
        result: products,
        lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1],
        firstDoc: productsSnapshot.docs[0],
    };
};

export const getLicencesToUpdateNumPages = async (
    numPerPages: number,
): Promise<number> => {
    const count = await getCountFromServer(
        query(
            licenseUpdateReqCollection,
            where("active", "==", true),
            where("aproved", "==", false),
        ),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};
