import { Timestamp } from "firebase/firestore";
import { Locations } from "./Locations";
import { LicenseInterface } from "./PersonalDocumentsInterface";
import { ServiceReqState, Services } from "./Services";
import { VehicleTransmission, VehicleType } from "./VehicleInterface";
import { emptyPhotoWithRef, ImgWithRef } from "./ImageInterface";

export interface VehicleTypeAndMode {
    type: VehicleType;
    mode: VehicleTransmission[];
}

export interface ServiceStateRequest {
    id: string;
    state: ServiceReqState;
}

export interface Vehicle {
    type: VehicleTypeAndMode;
    license: LicenseInterface;
}

export const userReqTypes = {
    driver: "Chofer",
    mechanic: "Mecanico",
    tow: "Operador de Grua",
};

export interface UserRequest {
    id: string;
    userId: string; // same identifier of the user
    newFullName: string;
    newProfilePhotoImgUrl: string | ImgWithRef; // if changing the name
    aproved?: boolean; // if the request was aproved, false when rejected or not reviewed yet
    active?: boolean; // will be true when it is a new request or update request and was not reviewed yet
    reviewedByHistory?: {
        // the history of the revisions made of the request, aproved or desaproved
        adminId: string; // the id of the admin user who aproved the service user request
        dateTime: Timestamp;
        aproved: boolean; // if the request was aproved, false when rejected or not reviewed yet
    }[];
    realTimePhotoImgUrl: ImgWithRef;
    // the url of the real time user selfie for identification verification for the request
    mechanicalWorkShop?: string; // id of the mechanical user works for if is mechanic user
    towEnterprite?: string; // id of the tow enterprise user works for if is tow user
    services: Services[];
    location?: Locations; // just if user does not have a location registered yet.
    vehicles?: Vehicle[]; // vehicles that are in the request
    policeRecordsPdf?: ImgWithRef;
}

export const emptyVehicleCar: Vehicle = {
    type: {
        type: VehicleType.CAR,
        mode: [VehicleTransmission.AUTOMATIC],
    },
    license: {
        expiredDateLicense: Timestamp.fromDate(new Date()),
        licenseNumber: "",
        backImgUrl: emptyPhotoWithRef,
        frontImgUrl: emptyPhotoWithRef,
    },
};

export const licenseBuilder = (
    licenseNumber: string,
    expiredDateLicense: Date,
    frontImgUrl: ImgWithRef,
    backImgUrl: ImgWithRef,
): LicenseInterface => {
    return {
        licenseNumber,
        expiredDateLicense: Timestamp.fromDate(expiredDateLicense),
        frontImgUrl,
        backImgUrl,
    };
};

export const driveReqBuilder = (
    id: string,
    userId: string,
    newFullName: string,
    newProfilePhotoImgUrl: string | ImgWithRef,
    vehicles: Vehicle[],
    realTimePhotoImgUrl: ImgWithRef,
    services: Services[],
    location: Locations,
    policeRecordsPdf: ImgWithRef,
): UserRequest => {
    return {
        id,
        userId,
        newFullName,
        newProfilePhotoImgUrl,
        aproved: false,
        active: true,
        reviewedByHistory: [],
        realTimePhotoImgUrl,
        services: services,
        location,
        vehicles,
        policeRecordsPdf,
    };
};

export const emptyDriveReq = (): UserRequest => {
    return {
        id: "",
        userId: "",
        newFullName: "",
        newProfilePhotoImgUrl: emptyPhotoWithRef,
        aproved: false,
        active: true,
        reviewedByHistory: [],
        realTimePhotoImgUrl: emptyPhotoWithRef,
        services: [],
        location: Locations.CochabambaBolivia,
        vehicles: [],
    };
};

export const mechanicReqBuilder = (
    id: string,
    userId: string,
    newFullName: string,
    newProfilePhotoImgUrl: string | ImgWithRef,
    realTimePhotoImgUrl: ImgWithRef,
    services: Services[],
    location: Locations,
    mechanicalWorkShop: string | null,
): UserRequest => {
    if (mechanicalWorkShop !== null) {
        return {
            id,
            userId,
            newFullName,
            newProfilePhotoImgUrl,
            aproved: false,
            active: true,
            reviewedByHistory: [],
            realTimePhotoImgUrl,
            services: services,
            location,
            mechanicalWorkShop,
        };
    } else {
        return {
            id,
            userId,
            newFullName,
            newProfilePhotoImgUrl,
            aproved: false,
            active: true,
            reviewedByHistory: [],
            realTimePhotoImgUrl,
            services: services,
            location,
        };
    }
};

export const towReqBuilder = (
    id: string,
    userId: string,
    newFullName: string,
    newProfilePhotoImgUrl: string | ImgWithRef,
    towEnterprite: string,
    realTimePhotoImgUrl: ImgWithRef,
    services: Services[],
    location: Locations,
    vehicles: Vehicle[],
): UserRequest => {
    return {
        id,
        userId,
        newFullName,
        newProfilePhotoImgUrl,
        aproved: false,
        active: true,
        reviewedByHistory: [],
        realTimePhotoImgUrl,
        services: services,
        location,
        towEnterprite: towEnterprite,
        vehicles,
    };
};
