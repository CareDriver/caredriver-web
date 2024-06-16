import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { BrandingRequest } from "@/interfaces/BrandingInterface";
import {
    collection,
    doc,
    DocumentReference,
    DocumentSnapshot,
    getCountFromServer,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    setDoc,
    startAfter,
    updateDoc,
    where,
} from "firebase/firestore";

const brandingCollection = collection(firestore, Collections.BrandingRequests);

export const saveBrandingRequest = async (
    uid: string,
    data: BrandingRequest,
): Promise<DocumentReference> => {
    try {
        const docRef = doc(brandingCollection, uid);
        await setDoc(docRef, data);
        return docRef;
    } catch (error) {
        throw error;
    }
};

export const getBrandingReqById = async (
    reqId: string,
): Promise<BrandingRequest | undefined> => {
    try {
        const reqDoc = await getDoc(doc(brandingCollection, reqId));
        if (reqDoc.exists()) {
            var data = reqDoc.data() as BrandingRequest;
            data.id = reqId;
            return data;
        }
        return undefined;
    } catch (error) {
        throw error;
    }
};

export const updateBrandingReq = async (
    id: string,
    newData: Partial<BrandingRequest>,
): Promise<void> => {
    try {
        const ref = doc(brandingCollection, id);
        await updateDoc(ref, newData);
    } catch (error) {
        throw error;
    }
};

export const deleteBrandingReq = async (
    id: string,
    reviewedId: string,
    aproved: boolean,
) => {
    await updateBrandingReq(id, {
        active: false,
        aproved: aproved,
        reviewedId: reviewedId,
    });
};

export const getBrandingReqPaginated = async (
    direction: "next" | "prev" | undefined,
    startAfterDoc?: DocumentSnapshot,
    endBeforeDoc?: DocumentSnapshot,
    numPerPage: number = 8,
) => {
    let dataQuery = query(
        brandingCollection,
        orderBy("userName"),
        limit(numPerPage),
        where("active", "==", true),
    );

    if (direction === "next" && startAfterDoc) {
        dataQuery = query(dataQuery, startAfter(startAfterDoc));
    }

    const productsSnapshot = await getDocs(dataQuery);
    const products = productsSnapshot.docs.map((doc) => {
        var brandingReq = doc.data() as BrandingRequest;
        brandingReq.id = doc.id;
        return brandingReq;
    });

    return {
        result: products as BrandingRequest[],
        lastDoc: productsSnapshot.docs[productsSnapshot.docs.length - 1],
        firstDoc: productsSnapshot.docs[0],
    };
};

export const getBrandingReqNumPages = async (numPerPages: number): Promise<number> => {
    const count = await getCountFromServer(
        query(brandingCollection, where("active", "==", true)),
    );
    const numPages = Math.ceil(count.data().count / numPerPages);
    return numPages;
};
