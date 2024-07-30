import { GeoPoint } from "firebase/firestore";
import { ImgWithRef } from "./ImageInterface";
import { Locations } from "./Locations";

export interface EnterpriseUser {
    userId: string;
    role: "user" | "support";
}

export const UserRoleEnterpriseRender = {
    user: "Usuario Servidor",
    support: "Soporte",
};

export enum EnterpriseType {
    Mechanical = "mechanical",
    Tow = "tow",
    Laundry = "laundry",
    Driver = "driver",
}

// Interface for crane companies
export interface Enterprise {
    id?: string;
    type: "mechanical" | "tow" | "laundry" | "driver";
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
    location?: Locations;
    addedUsersId?: string[];
    addedUsers?: EnterpriseUser[];
}

export interface ReqEditEnterprise extends Enterprise {
    enterpriseId: string;
}

export const EnterpriseTypeRender = {
    mechanical: "taller mecánico",
    tow: "empresa operadora de grúa",
    laundry: "lavadero de vehículos",
    driver: "empresa de choferes",
};

export const EnterpriseTypeRenderPronoun = {
    mechanical: "el taller mecánico",
    tow: "la empresa operadora de grúa",
    laundry: "el lavadero de vehículos",
    driver: "la empresa de choferes",
};

export const EnterpriseTypeRenderPronounV2 = {
    mechanical: "del taller mecánico",
    tow: "de la empresa operadora de grúa",
    laundry: "del lavadero de vehículos",
    driver: "de la empresa de choferes",
};

export const EnterpriseTypeRenderPronounV3 = {
    mechanical: "un taller mecánico",
    tow: "una empresa operadora de grúa",
    laundry: "un lavadero de vehículos",
    driver: "una empresa de choferes",
};
