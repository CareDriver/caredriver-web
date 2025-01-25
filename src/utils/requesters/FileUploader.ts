import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
    uploadString,
} from "firebase/storage";

import { firestore, storage } from "@/firebase/FirebaseConfig";
import { nanoid } from "nanoid";
import { RefAttachment } from "@/components/form/models/RefAttachment";

export const uploadFileBase64 = async (
    location: string,
    file: string,
): Promise<RefAttachment> => {
    const uniqueName = nanoid(40);
    const refLocation = `${location.concat(uniqueName)}`;
    const mountainsRef = ref(storage, refLocation);
    await uploadString(mountainsRef, file, "data_url");
    const url = await getDownloadURL(mountainsRef);
    return {
        ref: refLocation,
        url: url,
    };
};

export const uploadFileBlod = async (location: string, file: Blob) => {
    const uniqueName = nanoid(40);
    const refLocation = `${location.concat(uniqueName)}`;
    const mountainsRef = ref(storage, refLocation);
    await uploadBytes(mountainsRef, file);
    const url = await getDownloadURL(mountainsRef);
    return {
        ref: refLocation,
        url: url,
    };
};

export const deleteFile = async (refLocation: string) => {
    /* try {
        const mountainsRef = ref(storage, refLocation);
        await deleteObject(mountainsRef);
    } catch (e) {
        console.log(e);
    } */
};

import { doc, deleteDoc } from "firebase/firestore";

export const deleteDocument = async (collection: string, id: string) => {
    await deleteDoc(doc(firestore, collection, id));
};
