import { Timestamp } from "firebase/firestore";
import { RefAttachment } from "../components/form/models/RefAttachment";

export interface Branding {
  dateLimit: Timestamp;
  lastBrandingConfirmation: Timestamp;
  brandingConfirmations: Timestamp[];
}

export interface BrandingRequest {
  id: string;
  brandingImage: RefAttachment;
  userName: string;
  userId: string;
  reviewedId?: string;
  aproved: boolean;
  active: boolean;
}
