import { Timestamp } from "firebase/firestore";
import { Locations } from "./Locations";
import { LicenseInterface } from "./PersonalDocumentsInterface";
import { Services } from "./Services";
import { VehicleTransmission, VehicleType } from "./VehicleInterface";

interface UserRequest {
    id?: string; // same identifier of the user
    newProfilePhotoImgUrl: string; // if changing the name
    licenses?: {
        car?: LicenseInterface;
        motorcycle?: LicenseInterface;
        tow?: LicenseInterface;
    }; // Driver's license (just for drivers users), if drives all, it will have data of all licenses
    aproved?: boolean; // if the request was aproved, false when rejected or not reviewed yet
    active?: boolean; // will be true when it is a new request or update request and was not reviewed yet
    reviewedByHistory?: {
        // the history of the revisions made of the request, aproved or desaproved
        adminId: string; // the id of the admin user who aproved the service user request
        dateTime: Timestamp;
        aproved: boolean; // if the request was aproved, false when rejected or not reviewed yet
    }[];
    realTimePhotoImgUrl: string; 
    // the url of the real time user selfie for identification verification for the request
    mechanicalWorkShopId?: string; // id of the mechanical user works for if is mechanic user
    towEnterpriteId: string; // id of the tow enterprise user works for if is tow user
    services: Services[];
    location?: Locations; // just if user does not have a location registered yet.
    drivenVehicle?: { // The vehicle driver can drive
        type: VehicleType[]; // Type of the vehicle, either 'car' or 'motorcycle'
        transmission?: VehicleTransmission[]; // Type of transmission, either 'automatic' or 'mechanical'
    }
}