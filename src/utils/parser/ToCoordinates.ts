import { GeoPoint } from "firebase/firestore";
import { Location } from "@/utils/map/Locator";

export const toLocation = (point: GeoPoint): Location => {
    return {
        lat: point.latitude,
        lng: point.longitude,
    };
};
