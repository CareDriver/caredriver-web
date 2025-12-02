import { GeoPoint } from "firebase/firestore";
import { RefAttachment } from "../components/form/models/RefAttachment";
import { Locations } from "./Locations";
import { ServiceType } from "./Services";
import { ComissionHistory, DebtHistory, Price } from "./Payment";

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

export interface EnterpriseData {
  id?: string;
  type: ServiceType;
  name: string;
  nameArrayLower?: string[]; // Array with full name separated by words ej: ["nombre", "nombre"]
  logoImgUrl: RefAttachment;
  coordinates?: GeoPoint;
  latitude?: number;
  longitude?: number;
  phone?: string;
  phoneCountryCode?: string;
  userId: string;
  aproved?: boolean;
  aprovedBy?: string;
  deleted: boolean;
  active: boolean;
  location?: Locations;
  commition?: boolean;
  description?: string;
}

export interface Enterprise extends EnterpriseData {
  addedUsersId?: string[];
  addedUsers?: EnterpriseUser[];
  comissionsHistory?: ComissionHistory[];
  currentDebt?: Price;
  paidDebtsHistory?: DebtHistory[];
}

export interface ReqEditEnterprise extends EnterpriseData {
  enterpriseId: string;
}
