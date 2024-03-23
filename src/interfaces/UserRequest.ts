import { LicenseInterface } from "./PersonalDocumentsInterface";
import { Services } from "./Services";

interface UserRequest {
    id?: string; // same identifier of the user
    newProfilePhotoImgUrl: string; // if changing the name
    license?: LicenseInterface; // Just for driver and tow requests
    aprovedBy?: string; // the id of the admin user who aproved the service user request
    realTimePhotoImgUrl: string; 
    // the url of the real time user selfie for identification verification for the request
    mechanicalWorkShopId?: string; // id of the mechanical user works for if is mechanic user
    towEnterpriteId: string; // id of the tow enterprise user works for if is tow user
    services: Services[];
    location?: Locations; // just if user does not have a location registered yet.
}