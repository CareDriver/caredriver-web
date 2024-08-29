import { GeoPoint } from "firebase/firestore";
import { DEFAULT_LOCATION } from "../models/MapProperties";

export function getCurrentLocation(): GeoPoint {
    let currentLocation = DEFAULT_LOCATION;
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            currentLocation = new GeoPoint(latitude, longitude);
        },
        (error) => {
            console.log(error);
        },
    );

    return currentLocation;
}

export function geoPointToLatLng(geo: GeoPoint | undefined) {
    if (!geo) {
        return undefined;
    }

    return {
        lat: geo.latitude,
        lng: geo.longitude,
    };
}
