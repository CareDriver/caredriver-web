import { Timestamp } from "firebase/firestore";
import { Locations } from "./Locations";
import { LicenseInterface } from "./PersonalDocumentsInterface";
import { Services } from "./Services";
import { VehicleTransmission, VehicleType } from "./VehicleInterface";
import { emptyPhotoWithRef, ImgWithRef } from "./ImageInterface";

export interface MotorcycleType {
    type: VehicleType.MOTORCYCLE;
}

export interface CarType {
    type: VehicleType.CAR;
    mode: VehicleTransmission;
}

export interface Vehicle {
    type: CarType | MotorcycleType;
    license: LicenseInterface;
}

export interface UserRequest {
    id?: string; // same identifier of the user
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
    mechanicalWorkShopId?: string; // id of the mechanical user works for if is mechanic user
    towEnterpriteId?: string; // id of the tow enterprise user works for if is tow user
    services: Services[];
    location?: Locations; // just if user does not have a location registered yet.
    vehicles: Vehicle[];
}

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

/* export const reviewerBuilder = (adminId: string, date: Date, aproved: boolean) => {
    return {
        adminId,
        dateTime: Timestamp.fromDate(date),
        aproved,
    };
}; */

export const driveReqBuilder = (
    id: string,
    newFullName: string,
    newProfilePhotoImgUrl: string | ImgWithRef,
    vehicles: Vehicle[],
    realTimePhotoImgUrl: ImgWithRef,
    services: Services[],
    location: Locations,
): UserRequest => {
    return {
        id,
        newFullName,
        newProfilePhotoImgUrl,
        aproved: false,
        active: true,
        reviewedByHistory: [],
        realTimePhotoImgUrl,
        services: services,
        location,
        vehicles,
    };
};

export const emptyDriveReq = (): UserRequest => {
    return {
        id: "",
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
