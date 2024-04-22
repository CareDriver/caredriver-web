import { deleteObject, getDownloadURL, ref, uploadString } from "firebase/storage";

import { storage } from "@/firebase/FirebaseConfig";
import { nanoid } from "nanoid";
import { ImgWithRef } from "@/interfaces/ImageInterface";

export const uploadImageBase64 = async (
    location: string,
    image: string,
): Promise<ImgWithRef> => {
    const uniqueName = nanoid();
    const refLocation = `${location.concat(uniqueName)}`;
    const mountainsRef = ref(storage, refLocation);
    await uploadString(mountainsRef, image, "data_url");
    const url = await getDownloadURL(mountainsRef);
    return {
        ref: refLocation,
        url: url,
    };
};

export const deleteFile = async (refLocation: string) => {
    try {
        const mountainsRef = ref(storage, refLocation);
        await deleteObject(mountainsRef);
    } catch (e) {
        console.log(e);
    }
};
