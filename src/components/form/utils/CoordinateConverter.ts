import { CoordinateRegister } from "@/interfaces/RouteNavigationInterface";

export const toLocationFromCoordRes = (res: CoordinateRegister) => {
    return {
        lat: res.lat,
        lng: res.long,
    };
};

export const toLocationsFromCoordRes = (res: CoordinateRegister[]) => {
    return res.map((c) => toLocationFromCoordRes(c));
};
