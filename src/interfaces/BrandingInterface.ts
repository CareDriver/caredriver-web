import { Timestamp } from "firebase/firestore";
import { ImgWithRef } from "./ImageInterface";

export interface Branding {
    dateLimit: Timestamp;
    lastBrandingConfirmation: Timestamp;
    brandingConfirmations: Timestamp[];
}

export interface BrandingRequest {
    id: string;
    brandingImage: ImgWithRef;
    userName: string;
    userId: string;
    reviewedId?: string;
    aproved: boolean;
    active: boolean;
}
