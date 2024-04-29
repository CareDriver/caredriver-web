import { GeoPoint } from "firebase/firestore";
import { VehicleInterface } from "./VehicleInterface";
import { ServiceReqState, Services } from "./Services";
import { ServicesData } from "./ServicesDataInterface";
import { Payment, Price } from "./Payment";
import { Locations } from "./Locations";
import { ServiceStateRequest, Vehicle } from "./UserRequest";
import { ImgWithRef } from "./ImageInterface";

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

export enum UserRole {
    User = "User",
    Admin = "Admin",
    Support = "Support",
}

export interface UserInterface {
    id?: string; // Unique identifier for the user
    role?: UserRole; // the role that the user has in the application
    fullName: string; // Full name of the user
    phoneNumber: string; // Phone number of the user (includes country code, ej: +591 76543218)
    photoUrl: ImgWithRef; // URL of the user's photo

    comments: string[]; // Array of comments given by drivers
    vehicles: VehicleInterface[]; // Array of vehicles associated with the user
    services: Services[]; // The services the user can provide, just "normal" if it's a non-service user

    servicesData: ServicesData; // The comments and rating per service for the user
    pickUpLocationsHistory: HistoryLocationInterface[]; // Array of historical pickup locations
    deliveryLocationsHistory: HistoryLocationInterface[]; // Array of historical delivery locations

    email?: string; // User's email
    currentDebtWithTheApp?: Price; // current debt of a server user towards the application, will contain the money that the user owes to the application following the services made and last time he/she paid
    appPaymentHistory?: Payment[]; // Array of the payments made by the service user to the app.
    location?: Locations; // Location user begins
    disable?: boolean; // true when user did not paid to the app and was disabled.
    deleted: boolean; // used for soft delete
    mechanicalWorkShopId?: string; // id of the mechanical user works for if is mechanic user
    towEnterpriteId?: string; // id of the tow enterprise user works for if is tow user

    serviceVehicles?: ServiceVehicles; // vehicles that the user registered
    serviceRequests?: ServiceRequestsInterface // status of the services that the user made a request
}

export interface ServiceRequestsInterface {
    driveCar?: ServiceStateRequest;
    driveMotorcycle?: ServiceStateRequest;
    mechanic?: ServiceStateRequest;
    tow?: ServiceStateRequest;
}

export interface ServiceVehicles {
    car?: Vehicle;
    motorcycle?: Vehicle;
    tow?: Vehicle;
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
