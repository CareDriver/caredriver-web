/* TODO: move to env */

import { GeoPoint } from "firebase/firestore";

export const GOOGLEMAPS_TOKEN = "AIzaSyCRD_QILnPyrj9ZDSmdIFK9DuUhtYSa7PA";

export const BOUNDARIES = [-66.9181, -17.9787, -65.8668, -16.8052];

export const DEFAULT_LOCATION: GeoPoint = new GeoPoint(
    -17.39365618649978,
    -66.15692634503071,
);
