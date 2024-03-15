import { Timestamp } from "firebase/firestore";

// Interface for a license document
export interface LicenseInterface {
    licenseNumber: string; // Driver's license number
    expiredDateLicense: Timestamp; // The date the license is going to expire
    frontImgUrl: string; // The url of the front image of the license
    backImgUrl: string; // The url of the back image of the license
}

// Interface for the national document
export interface CIInterface {
    ciNumber: string; // Driver's license number
    frontImgUrl: string; // The url of the front image of the license
    backImgUrl: string; // The url of the back image of the license
}
