import { GeoPoint } from "firebase/firestore";
import { VehicleInterface } from "./VehicleInterface";
import { Services } from "./Services";
import { ServicesData, servicesData } from "./ServicesDataInterface";
import { CIInterface, LicenseInterface } from "./PersonalDocumentsInterface";
import { Payment, Price } from "./Payment";

export interface HistoryLocationInterface {
    locationName: string;
    // This interface was created for in the future add more attributes or options for users to save their locations, for example custom names as "Home", etc
    coordinates: GeoPoint | null; // Geographical coordinates for a location
}

export interface HistoryReadLocationInterface {
    locationName: string;
    // This interface was created for in the future add more attributes or options for users to save their locations, for example custom names as "Home", etc
    coordinates: {
        _lat: number | undefined;
        _long: number | undefined;
    }; // Geographical coordinates for a location
}

export interface UserInterface {
    id?: string; // Unique identifier for the user
    fullName: string; // Full name of the user
    phoneNumber: string; // Phone number of the user (includes country code, ej: +591 76543218)
    photoUrl: string; // URL of the user's photo

    comments: string[]; // Array of comments given by drivers
    vehicles: VehicleInterface[]; // Array of vehicles associated with the user
    services: Services[]; // The services the user can provide, just "normal" if it's a non-service user

    servicesData: ServicesData; // The comments and rating per service for the user
    pickUpLocationsHistory: HistoryReadLocationInterface[]; // Array of historical pickup locations
    deliveryLocationsHistory: HistoryReadLocationInterface[]; // Array of historical delivery locations

    // Attributes just for services user:
    license?: LicenseInterface; // Driver's license (just for drivers users)
    ci?: CIInterface; // User's national identification number (CI)
    email?: string; // User's email
    currentDebtWithTheApp?: Price; // current debt of a server user towards the application, will contain the money that the user owes to the application following the services made and last time he/she paid
    appPaymentHistory?: Payment[]; // Array of the payments made by the service user to the app.
    acceptedBy?: string; // the id of the admin user who accepted the service user
}

export interface UserQuery {
    vehicles: VehicleInterface[];
    pickUpLocationsHistory?: HistoryReadLocationInterface[];
    deliveryLocationsHistory?: HistoryReadLocationInterface[];
}
