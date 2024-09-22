import { Timestamp } from "firebase/firestore";
import { Locations } from "./Locations";
import { LicenseInterface } from "./PersonalDocumentsInterface";
import { ServiceReqState, Services, ServiceType } from "./Services";
import { VehicleTransmission, VehicleType } from "./VehicleInterface";
import {
    EMPTY_REF_ATTACHMENT,
    RefAttachment,
} from "../components/form/models/RefAttachment";
import { toCapitalize } from "@/utils/text_helpers/TextFormatter";
import { DRIVER } from "@/models/Business";

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
    driver: toCapitalize(DRIVER),
    mechanical: "Mecánico",
    tow: "Operador de Grúa",
    laundry: "Lavadero",
};

/* TODO: move to the module that belongs */
export const TYPES_OF_SERVICE: ServiceType[] = [
    "driver",
    "mechanical",
    "tow",
    "laundry",
];

export function inputToServiceType(input: string): ServiceType {
    let defaulServiceType: ServiceType = "driver";
    return TYPES_OF_SERVICE.includes(input as ServiceType)
        ? (input as ServiceType)
        : defaulServiceType;
}

export interface UserRequest {
    id: string;
    userId: string; // same identifier of the user
    newFullName: string;
    newProfilePhotoImgUrl: string | RefAttachment; // if changing the name
    aproved?: boolean; // if the request was aproved, false when rejected or not reviewed yet
    active?: boolean; // will be true when it is a new request or update request and was not reviewed yet
    reviewedByHistory?: {
        // the history of the revisions made of the request, aproved or desaproved
        adminId: string; // the id of the admin user who aproved the service user request
        dateTime: Timestamp;
        aproved: boolean; // if the request was aproved, false when rejected or not reviewed yet
    }[];
    realTimePhotoImgUrl: RefAttachment;
    // the url of the real time user selfie for identification verification for the request
    mechanicalWorkShop?: string; // id of the mechanical user works for if is mechanic user
    towEnterprite?: string; // id of the tow enterprise user works for if is tow user
    laundryEnterprite?: string; // id of the laundry enterprise user works for if is tow user
    driverEnterprise?: string; // id of the driver enterprise user works for if is tow user
    services: Services[];
    location?: Locations; // just if user does not have a location registered yet.
    vehicles?: Vehicle[]; // vehicles that are in the request
    policeRecordsPdf?: RefAttachment;
    mechanicTools?: string;
}

export const emptyVehicleCar: Vehicle = {
    type: {
        type: VehicleType.CAR,
        mode: [VehicleTransmission.AUTOMATIC],
    },
    license: {
        expiredDateLicense: Timestamp.now(),
        licenseNumber: "",
        backImgUrl: EMPTY_REF_ATTACHMENT,
        frontImgUrl: EMPTY_REF_ATTACHMENT,
    },
};

export const licenseBuilder = (
    licenseNumber: string,
    expiredDateLicense: Date,
    frontImgUrl: RefAttachment,
    backImgUrl: RefAttachment,
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
    newProfilePhotoImgUrl: string | RefAttachment,
    vehicles: Vehicle[],
    realTimePhotoImgUrl: RefAttachment,
    services: Services[],
    location: Locations,
    driverEnterprise: string,
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
        driverEnterprise,
    };
};

export const emptyDriveReq = (): UserRequest => {
    return {
        id: "",
        userId: "",
        newFullName: "",
        newProfilePhotoImgUrl: EMPTY_REF_ATTACHMENT,
        aproved: false,
        active: true,
        reviewedByHistory: [],
        realTimePhotoImgUrl: EMPTY_REF_ATTACHMENT,
        services: [],
        location: Locations.CochabambaBolivia,
        vehicles: [],
        driverEnterprise: "",
    };
};

export const mechanicReqBuilder = (
    id: string,
    userId: string,
    newFullName: string,
    newProfilePhotoImgUrl: string | RefAttachment,
    realTimePhotoImgUrl: RefAttachment,
    services: Services[],
    location: Locations,
    mechanicalWorkShop: string | undefined,
    mechanicTools: string,
): UserRequest => {
    if (mechanicalWorkShop) {
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
            mechanicTools,
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
            mechanicTools,
        };
    }
};

export const laundryReqBuilder = (
    id: string,
    userId: string,
    newFullName: string,
    newProfilePhotoImgUrl: string | RefAttachment,
    realTimePhotoImgUrl: RefAttachment,
    services: Services[],
    location: Locations,
    laundryEnterprite: string,
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
        laundryEnterprite,
    };
};

export const towReqBuilder = (
    id: string,
    userId: string,
    newFullName: string,
    newProfilePhotoImgUrl: string | RefAttachment,
    towEnterprite: string,
    realTimePhotoImgUrl: RefAttachment,
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
