import { GeoPoint } from "firebase/firestore";
import { VehicleInterface, VehicleTransmission, VehicleType } from "./VehicleInterface";
import { ServiceReqState, Services } from "./Services";
import { ServicesData } from "./ServicesDataInterface";
import { LicenseInterface } from "./PersonalDocumentsInterface";
import { Payment, Price } from "./Payment";
import { Locations } from "./Locations";

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
    pickUpLocationsHistory: HistoryLocationInterface[]; // Array of historical pickup locations
    deliveryLocationsHistory: HistoryLocationInterface[]; // Array of historical delivery locations

    // Attributes just for services user:
    licenses?: {
        car?: LicenseInterface;
        motorcycle?: LicenseInterface;
        tow?: LicenseInterface;
    }; // Driver's license (just for drivers users), if drives all, it will have data of all licenses
    email?: string; // User's email
    currentDebtWithTheApp?: Price; // current debt of a server user towards the application, will contain the money that the user owes to the application following the services made and last time he/she paid
    appPaymentHistory?: Payment[]; // Array of the payments made by the service user to the app.
    location?: Locations; // Location user begins
    disable?: boolean; // true when user did not paid to the app and was disabled.
    mechanicalWorkShopId?: string; // id of the mechanical user works for if is mechanic user
    towEnterpriteId?: string; // id of the tow enterprise user works for if is tow user
    drivenVehicle?: {
        // The vehicle driver can drive
        type: VehicleType[]; // Type of the vehicle, either 'car' or 'motorcycle'
        transmission?: VehicleTransmission[]; // Type of transmission, either 'automatic' or 'mechanical'
    };

    serviceRequests: {
        driveCar: {
            id: string;
            state: ServiceReqState;
        };
        driveMotorcycle: {
            id: string;
            state: ServiceReqState;
        };
        mechanic: {
            id: string;
            state: ServiceReqState;
        };
        tow: {
            id: string;
            state: ServiceReqState;
        };
    };
}

export const defaultServiceReq = {
    driveCar: {
        id: "",
        state: ServiceReqState.NotSent,
    },
    driveMotorcycle: {
        id: "",
        state: ServiceReqState.NotSent,
    },
    mechanic: {
        id: "",
        state: ServiceReqState.NotSent,
    },
    tow: {
        id: "",
        state: ServiceReqState.NotSent,
    },
};

export interface ServiceRequest {
    type: Services;
    state: ServiceReqState;
}

export interface UserQuery {
    vehicles: VehicleInterface[];
    pickUpLocationsHistory?: HistoryReadLocationInterface[];
    deliveryLocationsHistory?: HistoryReadLocationInterface[];
}
