import { Timestamp } from "firebase/firestore";
import { RefAttachment } from "../components/form/models/RefAttachment";
import { VehicleType } from "./VehicleInterface";

// Interface for a license document
export interface LicenseInterface {
  licenseNumber: string; // Driver's license number
  expiredDateLicense: Timestamp; // The date the license is going to expire
  frontImgUrl?: RefAttachment; // The url of the front image of the license
  backImgUrl?: RefAttachment; // The url of the back image of the license
  category: string; // Categoría de la licencia, A, B, C
  requireGlasses: boolean;
  requireHeadphones: boolean;
}

export interface LicenseUpdateReq {
  id: string;
  userId: string;
  userName: string;
  vehicleType: VehicleType;
  licenseNumber: string; // Driver's license number
  expiredDateLicense: Timestamp; // The date the license is going to expire
  frontImgUrl?: RefAttachment; // The url of the front image of the license
  backImgUrl?: RefAttachment;
  realTimePhotoImgUrl: RefAttachment;
  aproved: boolean;
  active: boolean;
  category: string;
  requireGlasses: boolean;
  requireHeadphones: boolean;
}
