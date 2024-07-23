import { GeoPoint } from "firebase/firestore";

export interface Location {
    lat: number;
    lng: number;
}

export const BOUNDARIES = [-66.9181, -17.9787, -65.8668, -16.8052];

export const DEFAULT_LOCATION: Location = {
    lat: -17.39365618649978,
    lng: -66.15692634503071,
};

export const equalToGeopoint = (location: Location, geopoint: GeoPoint): boolean => {
    return location.lat === geopoint.latitude && location.lng === geopoint.longitude;
};

export const getCurrentLocation = () => {
    let currentLocation = DEFAULT_LOCATION;
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            currentLocation = {
                lat: latitude,
                lng: longitude,
            };
        },
        (error) => {
            console.log(error);
        },
    );

    return currentLocation;
};
