import { GeoPoint } from "firebase/firestore";
import { ImgWithRef } from "./ImageInterface";

export enum EnterpriseType {
    Mechanical = "mechanical",
    Tow = "tow",
    Laundry = "laundry",
}

// Interface for crane companies
export interface Enterprise {
    id?: string;
    type: "mechanical" | "tow" | "laundry";
    name: string;
    logoImgUrl: ImgWithRef;
    coordinates?: GeoPoint; // Mandatory just for mechanics
    latitude?: number;
    longitude?: number;
    phone?: string; // Optional (No need to be verified)
    userId: string; // The user who created the enterprise
    aproved?: boolean; // If the enterprise was aproved or is in reviewing
    aprovedBy?: string; // the id of the admin user who aproved the enterprise registration
    deleted: boolean; // It will be used for soft delete, to avoid saving repeated data in other documents. This also helps to restore them
    active: boolean; // To be able to disable or enable it
}

export interface ReqEditEnterprise extends Enterprise {
    enterpriseId: string;
}

export const EnterpriseTypeRender = {
    mechanical: "taller mecanico",
    tow: "empresa operadora de grua",
    laundry: "lavadero de vehiculos",
};

export const EnterpriseTypeRenderPronoun = {
    mechanical: "el taller mecanico",
    tow: "la empresa operadora de grua",
    laundry: "el lavadero de vehiculos",
};

export const EnterpriseTypeRenderPronounV2 = {
    mechanical: "del taller mecanico",
    tow: "de la empresa operadora de grua",
    laundry: "del lavadero de vehiculos",
};

export const EnterpriseTypeRenderPronounV3 = {
    mechanical: "un taller mecanico",
    tow: "una empresa operadora de grua",
    laundry: "un lavadero de vehiculos",
};
