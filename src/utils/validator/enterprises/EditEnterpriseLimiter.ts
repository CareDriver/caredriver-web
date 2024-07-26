import { PhotoField } from "@/components/services/FormModels";
import { Collections } from "@/firebase/CollecionNames";
import { firestore } from "@/firebase/FirebaseConfig";
import { Enterprise } from "@/interfaces/Enterprise";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Location, equalToGeopoint } from "@/utils/map/Locator";
import { Locations } from "@/interfaces/Locations";

export const EditENT_thereAreActiveReqsFromUser = async (
    userId: string,
    enterpriseId: string,
): Promise<boolean> => {
    const collectionConnection = collection(firestore, Collections.EditEnterprises);
    try {
        const q = query(
            collectionConnection,
            where("active", "==", true),
            where("enterpriseId", "==", enterpriseId),
            where("userId", "==", userId),
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.size > 0;
    } catch (error) {
        console.error("Error counting active requests:", error);
        return false;
    }
};

export const EditENT_hasChanges = (
    formData: {
        name: {
            value: string;
            message: string | null;
        };
        phone: {
            value: string;
            message: string | null;
        };
        logo: PhotoField;
        location: Locations;
        coordinates: {
            value: Location | null;
            message: string | null;
        };
    },
    currentEnterprise: Enterprise,
): boolean => {
    return (
        formData.name.value !== currentEnterprise.name ||
        formData.phone.value !== currentEnterprise.phone ||
        formData.logo.value !== currentEnterprise.logoImgUrl.url ||
        (currentEnterprise.location !== undefined &&
            formData.location !== currentEnterprise.location) ||
        (formData.coordinates.value !== null &&
            currentEnterprise.coordinates !== null &&
            currentEnterprise.coordinates !== undefined &&
            !equalToGeopoint(formData.coordinates.value, currentEnterprise.coordinates))
    );
};
