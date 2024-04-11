import { Timestamp } from "firebase/firestore";
import { ImgWithRef } from "./ImageInterface";

// Interface for a license document
export interface LicenseInterface {
    licenseNumber: string; // Driver's license number
    expiredDateLicense: Timestamp; // The date the license is going to expire
    frontImgUrl?: ImgWithRef; // The url of the front image of the license
    backImgUrl?: ImgWithRef; // The url of the back image of the license
}
