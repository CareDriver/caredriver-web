import { GeoPoint } from "firebase/firestore";
import { Location } from "@/utils/map/Locator";
import { CoordinateRegister } from "@/interfaces/RouteNavigationInterface";

export const toLocation = (point: GeoPoint): Location => {
    return {
        lat: point.latitude,
        lng: point.longitude,
    };
};

export const toLocationFromPoints = (lat: number, lng: number): Location => {
    return {
        lat,
        lng,
    };
};

export const toLocationFromCoordRes = (res: CoordinateRegister): Location => {
    return {
        lat: res.lat,
        lng: res.long,
    };
};

export const toLocationsFromCoordRes = (res: CoordinateRegister[]): Location[] => {
    return res.map((c) => toLocationFromCoordRes(c));
};
