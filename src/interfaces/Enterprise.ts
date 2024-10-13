import { GeoPoint } from "firebase/firestore";
import { RefAttachment } from "../components/form/models/RefAttachment";
import { Locations } from "./Locations";
import { ServiceType } from "./Services";

export type UserRoleInEnterprise = "user" | "support";

export interface EnterpriseUser {
    userId: string;
    fakeUserId: string;
    role: UserRoleInEnterprise;
}

export const UserRoleEnterpriseRender = {
    user: "Servidores",
    support: "Soporte",
};

// Interface for crane companies
export interface Enterprise {
    id?: string;
    type: ServiceType;
    name: string;
    logoImgUrl: RefAttachment;
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
    commition?: boolean;
    description?: string;
}

export interface ReqEditEnterprise extends Enterprise {
    enterpriseId: string;
}
