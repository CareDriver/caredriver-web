import { GeoPoint, Timestamp } from "firebase/firestore";
import {
  EMPTY_REF_ATTACHMENT,
  RefAttachment,
} from "../components/form/models/RefAttachment";
import { Locations } from "./Locations";
import { ServiceType } from "./Services";
import {
  BalanceHistoryItem,
  ComissionHistory,
  DebtHistory,
  Price,
  defaultBalance,
} from "./Payment";
import { LicenseInterface } from "./PersonalDocumentsInterface";
import { VehicleType, VehicleTransmission } from "./VehicleInterface";
import {
  MechanicSubService,
  MechanicToolEvidence,
  TechnicalTitleEvidence,
} from "./UserRequest";

// ─── Legacy roles (kept for backward compatibility) ─────────────────────────
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

// ─── New enterprise member system ───────────────────────────────────────────
export type EnterpriseMemberRole = "admin" | "collaborator";

export const EnterpriseMemberRoleRender: Record<EnterpriseMemberRole, string> =
  {
    admin: "Administrador",
    collaborator: "Colaborador",
  };

/**
 * Car wash service mode:
 * - mobile_only: The equipo va al punto del usuario
 * - pickup_and_return: Recoge el auto del usuario, lo lava en el local y lo devuelve
 * - both: Ofrece ambas modalidades
 */
export enum CarWashServiceMode {
  MobileOnly = "mobile_only",
  PickupAndReturn = "pickup_and_return",
  Both = "both",
}

export const CarWashServiceModeRender: Record<CarWashServiceMode, string> = {
  [CarWashServiceMode.MobileOnly]: "Lavado móvil (vamos a tu ubicación)",
  [CarWashServiceMode.PickupAndReturn]:
    "Recojo y devolución (recogemos tu auto, lo lavamos y te lo devolvemos)",
  [CarWashServiceMode.Both]: "Ambas modalidades",
};

/**
 * Represents a member (admin or collaborator) of an enterprise.
 * - All admins MUST provide personal data (carnet, factura de luz, dirección).
 * - Admins can optionally be collaboradores also (`isAlsoCollaborator`).
 * - Collaboradores are the people who go and provide the service.
 * - Collaboradores must accept membership via the hub (`accepted` field).
 */
export interface EnterpriseMember {
  userId: string;
  fakeUserId: string;
  role: EnterpriseMemberRole;
  isAlsoCollaborator?: boolean; // Admin that is also a field collaborator
  accepted: boolean; // User accepted membership in the hub

  // Review status (for admin panel review)
  requiresAdminReview: boolean; // true for driver, tow, car-wash-pickup collaborators
  adminReviewApproved?: boolean; // undefined = pending, true = approved, false = rejected
  reviewedBy?: string; // admin who reviewed

  // Personal data (required for admins; for collaborators provided by enterprise admin)
  fullName: string;
  profilePhoto: RefAttachment;
  identityCardFront?: RefAttachment;
  identityCardBack?: RefAttachment;
  addressPhoto?: RefAttachment; // Factura de luz - NOT required for car wash
  homeAddress?: string; // NOT required for car wash

  // Driver / Tow / Car-wash-pickup specific
  vehicleType?: VehicleType; // Car or motorcycle (driver enterprises)
  vehicleTransmissions?: VehicleTransmission[]; // Automatic, mechanical (driver enterprises)
  license?: LicenseInterface;
  policeRecordsPdf?: RefAttachment; // Optional

  // Mechanic specific
  technicalTitle?: TechnicalTitleEvidence; // Optional for collaborators

  // Experience (stored on user profile upon approval)
  experience?: string;

  // Tow specific - vehicle photos
  vehiclePhotos?: RefAttachment[];
}

// ─── Enterprise base data ───────────────────────────────────────────────────
export interface EnterpriseData {
  id?: string;
  type: ServiceType;
  name: string;
  nameArrayLower?: string[];
  logoImgUrl: RefAttachment;
  coordinates?: GeoPoint;
  latitude?: number;
  longitude?: number;
  phone?: string;
  phoneCountryCode?: string;
  userId: string; // Account that registered the enterprise (auto-admin)
  aproved?: boolean;
  aprovedBy?: string;
  deleted: boolean;
  active: boolean;
  location?: Locations;
  commition?: boolean;
  description?: string; // Free text: can include NIT, extra info
}

// ─── Full enterprise document ───────────────────────────────────────────────
export interface Enterprise extends EnterpriseData {
  // Legacy user system (kept for backward compat)
  addedUsersId?: string[];
  addedUsers?: EnterpriseUser[];

  // New member system
  adminUserIds: string[]; // fakeIds of enterprise admins
  collaboratorUserIds: string[]; // fakeIds of collaborators
  members: EnterpriseMember[];

  // Rating
  rating?: number;
  ratingCount?: number;

  // Mechanic-specific enterprise data
  mechanicSubServices?: MechanicSubService[];
  mechanicTools?: string;
  mechanicToolEvidences?: MechanicToolEvidence[];

  // Car wash-specific
  carWashServiceMode?: CarWashServiceMode;

  // Tow-specific: enterprise fleet photos
  towVehiclePhotos?: RefAttachment[];

  // Financial
  currentDebt?: Price;
  paidDebtsHistory?: DebtHistory[];
  comissionsHistory?: ComissionHistory[];
  balanceHistory?: BalanceHistoryItem[];

  // Timestamps
  createdAt?: Timestamp;
  approvedAt?: Timestamp;
}

export interface ReqEditEnterprise extends EnterpriseData {
  enterpriseId: string;
}

// ─── Enterprise request (for new enterprise registration) ───────────────────
export interface EnterpriseRequest {
  id: string;
  type: ServiceType;
  name: string;
  nameArrayLower?: string[];
  logoImgUrl: RefAttachment;
  description?: string;
  coordinates?: GeoPoint;
  latitude?: number;
  longitude?: number;
  location?: Locations;

  // Who is registering (becomes auto-admin)
  requestedByUserId: string;
  requestedByFakeId: string;

  // Admin review state
  active: boolean; // true while pending
  aproved?: boolean;
  aprovedBy?: string;
  deleted: boolean;

  // Members included in the request
  members: EnterpriseMember[];
  adminUserIds: string[]; // fakeIds
  collaboratorUserIds: string[]; // fakeIds

  // Mechanic-specific
  mechanicSubServices?: MechanicSubService[];
  mechanicTools?: string;
  mechanicToolEvidences?: MechanicToolEvidence[];

  // Car wash-specific
  carWashServiceMode?: CarWashServiceMode;

  // Tow-specific
  towVehiclePhotos?: RefAttachment[];

  phone?: string;
  phoneCountryCode?: string;

  createdAt: Timestamp;
}

// ─── Defaults / Builders ────────────────────────────────────────────────────

export const EMPTY_ENTERPRISE_MEMBER: EnterpriseMember = {
  userId: "",
  fakeUserId: "",
  role: "collaborator",
  accepted: false,
  requiresAdminReview: false,
  fullName: "",
  profilePhoto: EMPTY_REF_ATTACHMENT,
};

export const buildEnterpriseRequest = (
  id: string,
  type: ServiceType,
  name: string,
  logoImgUrl: RefAttachment,
  requestedByUserId: string,
  requestedByFakeId: string,
  members: EnterpriseMember[],
  opts?: {
    description?: string;
    coordinates?: GeoPoint;
    latitude?: number;
    longitude?: number;
    location?: Locations;
    mechanicSubServices?: MechanicSubService[];
    mechanicTools?: string;
    mechanicToolEvidences?: MechanicToolEvidence[];
    carWashServiceMode?: CarWashServiceMode;
    towVehiclePhotos?: RefAttachment[];
    phone?: string;
    phoneCountryCode?: string;
  },
): EnterpriseRequest => {
  const adminIds = members
    .filter((m) => m.role === "admin")
    .map((m) => m.fakeUserId);
  const collabIds = members
    .filter((m) => m.role === "collaborator" || m.isAlsoCollaborator)
    .map((m) => m.fakeUserId);

  return {
    id,
    type,
    name,
    logoImgUrl,
    requestedByUserId,
    requestedByFakeId,
    active: true,
    deleted: false,
    members,
    adminUserIds: adminIds,
    collaboratorUserIds: collabIds,
    createdAt: Timestamp.now(),
    description: opts?.description,
    coordinates: opts?.coordinates,
    latitude: opts?.latitude,
    longitude: opts?.longitude,
    location: opts?.location,
    mechanicSubServices: opts?.mechanicSubServices,
    mechanicTools: opts?.mechanicTools,
    mechanicToolEvidences: opts?.mechanicToolEvidences,
    carWashServiceMode: opts?.carWashServiceMode,
    towVehiclePhotos: opts?.towVehiclePhotos,
    phone: opts?.phone,
    phoneCountryCode: opts?.phoneCountryCode,
  };
};

export const buildDefaultEnterprise = (
  request: EnterpriseRequest,
  approvedBy: string,
): Enterprise => {
  return {
    id: request.id,
    type: request.type,
    name: request.name,
    nameArrayLower: request.nameArrayLower,
    logoImgUrl: request.logoImgUrl,
    description: request.description,
    coordinates: request.coordinates,
    latitude: request.latitude,
    longitude: request.longitude,
    location: request.location,
    userId: request.requestedByUserId,
    aproved: true,
    aprovedBy: approvedBy,
    deleted: false,
    active: true,
    adminUserIds: request.adminUserIds,
    collaboratorUserIds: request.collaboratorUserIds,
    members: request.members,
    mechanicSubServices: request.mechanicSubServices,
    mechanicTools: request.mechanicTools,
    mechanicToolEvidences: request.mechanicToolEvidences,
    carWashServiceMode: request.carWashServiceMode,
    towVehiclePhotos: request.towVehiclePhotos,
    phone: request.phone,
    phoneCountryCode: request.phoneCountryCode,
    currentDebt: { currency: "Bs. (BOB)", amount: -40 },
    createdAt: request.createdAt,
    approvedAt: Timestamp.now(),
  };
};

/**
 * Determines whether a collaborator requires CareDriver admin review based
 * on the enterprise type and car wash service mode.
 *
 * Rules:
 * - Mechanic: NO review needed (enterprise manages directly)
 * - Car wash mobile-only: NO review needed
 * - Car wash pickup/both: YES review (license required)
 * - Driver: YES review (license required)
 * - Tow: YES review (license required)
 */
export function collaboratorRequiresReview(
  serviceType: ServiceType,
  carWashMode?: CarWashServiceMode,
): boolean {
  switch (serviceType) {
    case "mechanical":
      return false;
    case "laundry":
      if (carWashMode === CarWashServiceMode.MobileOnly) return false;
      return true; // pickup_and_return or both
    case "driver":
      return true;
    case "tow":
      return true;
    default:
      return true;
  }
}
