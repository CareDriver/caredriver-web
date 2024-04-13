import { GeoPoint } from "firebase/firestore";
import { ImgWithRef } from "./ImageInterface";

export enum EnterpriseType {
    Mechanical = "mechanical",
    Tow = "tow",
}

// Interface for crane companies
export interface Enterprise {
    id?: string;
    type: "mechanical" | "tow";
    name: string;
    logoImgUrl: ImgWithRef;
    coordinates?: GeoPoint; // Mandatory just for mechanics
    phone?: string; // Optional (No need to be verified)
    userId: string; // The user who created the enterprise
    aproved?: boolean; // If the enterprise was aproved or is in reviewing
    aprovedBy?: string; // the id of the admin user who aproved the enterprise registration
}

export interface ReqEditEnterprise {
    id?: string;
    enterpriseId: string;
    type: "mechanical" | "tow";
    name: string;
    logoImgUrl: ImgWithRef;
    coordinates?: GeoPoint; // Mandatory just for mechanics
    phone?: string; // Optional (No need to be verified)
    userId: string; // The user who created the enterprise
    aproved?: boolean; // If the enterprise was aproved or is in reviewing
    aprovedBy?: string;
}
