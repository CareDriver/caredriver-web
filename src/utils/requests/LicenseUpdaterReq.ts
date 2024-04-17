import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { LicenseUpdateReq } from "@/interfaces/PersonalDocumentsInterface";
import { collection, doc, setDoc } from "firebase/firestore";

const licenseUpdateReqCollection = collection(firestore, Collections.LicenseUpdateReq);

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
