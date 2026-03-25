import { Timestamp } from "firebase/firestore";
import { Locations } from "./Locations";
import { LicenseInterface } from "./PersonalDocumentsInterface";
import { ServiceReqState, Services, ServiceType } from "./Services";
import { VehicleTransmission, VehicleType } from "./VehicleInterface";
import {
  EMPTY_REF_ATTACHMENT,
  RefAttachment,
} from "../components/form/models/RefAttachment";
import { toCapitalize } from "@/utils/text_helpers/TextFormatter";
import { DRIVER } from "@/models/Business";
import { Gender } from "./UserInterface";
import { LicenseCategories } from "./LicenseCategories";
import { BloodTypes } from "./BloodTypes";

export interface VehicleTypeAndMode {
  type: VehicleType;
  mode: VehicleTransmission[];
}

export interface ServiceStateRequest {
  id: string;
  state: ServiceReqState;
}

export interface Vehicle {
  type: VehicleTypeAndMode;
  license: LicenseInterface;
}

export interface MechanicToolEvidence {
  name: string;
  photo: RefAttachment;
}

export interface TechnicalTitleEvidence {
  titleName: string;
  issueDate?: Timestamp;
  photo: RefAttachment;
}

export enum MechanicSubService {
  BatteryJumpStart = "Pasa corriente",
  TireChange = "Cambio de llanta",
  TireInflation = "Inflado de llanta",
  FlatTireAssistance = "Llanta pinchada",
  FuelDelivery = "Combustible",
  VehicleUnlock = "Cerrajería",
  ObdScan = "Escaneo OBD",
  HomeQuickCheck = "Chequeo a domicilio",
}

export const MECHANIC_SUB_SERVICES: {
  key: MechanicSubService;
  description: string;
}[] = [
  {
    key: MechanicSubService.BatteryJumpStart,
    description: "Arranque con batería cuando está descargada.",
  },
  {
    key: MechanicSubService.TireChange,
    description:
      "Cambio de llanta de repuesto cuando el conductor no sabe cambiarla o no tiene herramientas.",
  },
  {
    key: MechanicSubService.TireInflation,
    description: "Inflado de llanta baja (no pinchada).",
  },
  {
    key: MechanicSubService.FlatTireAssistance,
    description:
      "Auxilio por llanta pinchada: parche rápido o instalación de repuesto.",
  },
  {
    key: MechanicSubService.FuelDelivery,
    description: "Entrega de combustible cuando alguien se queda sin gasolina.",
  },
  {
    key: MechanicSubService.VehicleUnlock,
    description:
      "Apertura de vehículo cuando el conductor deja las llaves dentro.",
  },
  {
    key: MechanicSubService.ObdScan,
    description: "Escaneo electrónico del vehículo con escáner OBD.",
  },
  {
    key: MechanicSubService.HomeQuickCheck,
    description:
      "Chequeo rápido del vehículo a domicilio: aceite, refrigerante, frenos, batería, llantas, luces y fugas (10–15 min).",
  },
];

export const userReqTypes = {
  driver: toCapitalize(DRIVER),
  mechanical: "Mecánico",
  tow: "Remolque",
  laundry: "Lavadero",
};

/* TODO: move to the module that belongs */
export const TYPES_OF_SERVICE: ServiceType[] = [
  "driver",
  "mechanical",
  "tow",
  "laundry",
];

export function inputToServiceType(input: string): ServiceType {
  let defaulServiceType: ServiceType = "driver";
  return TYPES_OF_SERVICE.includes(input as ServiceType)
    ? (input as ServiceType)
    : defaulServiceType;
}

export interface UserRequest {
  id: string;
  userId: string; // same identifier of the user
  newFullName: string; // if changing the name
  homeAddress: string;
  addressPhoto: string | RefAttachment;
  newProfilePhotoImgUrl: string | RefAttachment;
  bloodType?: BloodTypes;
  gender?: Gender;
  aproved?: boolean; // if the request was aproved, false when rejected or not reviewed yet
  active?: boolean; // will be true when it is a new request or update request and was not reviewed yet
  reviewedByHistory?: {
    // the history of the revisions made of the request, aproved or desaproved
    adminId: string; // the id of the admin user who aproved the service user request
    dateTime: Timestamp;
    aproved: boolean; // if the request was aproved, false when rejected or not reviewed yet
  }[];
  realTimePhotoImgUrl: RefAttachment;
  // the url of the real time user selfie for identification verification for the request
  mechanicalWorkShop?: string; // id of the mechanical user works for if is mechanic user
  towEnterprite?: string; // id of the tow enterprise user works for if is tow user
  laundryEnterprite?: string; // id of the laundry enterprise user works for if is tow user
  driverEnterprise?: string; // id of the driver enterprise user works for if is tow user
  services: Services[];
  location?: Locations; // just if user does not have a location registered yet.
  vehicles?: Vehicle[]; // vehicles that are in the request
  policeRecordsPdf?: RefAttachment;
  policeRecordPendingByChat?: boolean;
  driverExperience?: string;
  towVehiclePhoto?: RefAttachment;
  towExperience?: string;
  mechanicTools?: string;
  mechanicSubServices?: MechanicSubService[];
  mechanicToolEvidences?: MechanicToolEvidence[];
  mechanicTechnicalTitle?: TechnicalTitleEvidence;
  mechanicExperience?: string;
  isMechanicUpdateRequest?: boolean;
}

export const emptyVehicleCar: Vehicle = {
  type: {
    type: VehicleType.CAR,
    mode: [VehicleTransmission.AUTOMATIC],
  },
  license: {
    expiredDateLicense: Timestamp.now(),
    licenseNumber: "",
    backImgUrl: EMPTY_REF_ATTACHMENT,
    frontImgUrl: EMPTY_REF_ATTACHMENT,
    category: LicenseCategories.CategoryP,
    requireGlasses: false,
    requireHeadphones: false,
  },
};

export const licenseBuilder = (
  licenseNumber: string,
  expiredDateLicense: Date,
  frontImgUrl: RefAttachment,
  backImgUrl: RefAttachment,
  category: LicenseCategories,
  requireGlasses: boolean,
  requireHeadphones: boolean,
): LicenseInterface => {
  return {
    licenseNumber,
    expiredDateLicense: Timestamp.fromDate(expiredDateLicense),
    frontImgUrl,
    backImgUrl,
    category,
    requireGlasses,
    requireHeadphones,
  };
};

export const driveReqBuilder = (
  id: string,
  userId: string,
  newFullName: string,
  homeAddress: string,
  addressPhoto: string | RefAttachment,
  newProfilePhotoImgUrl: string | RefAttachment,
  vehicles: Vehicle[],
  realTimePhotoImgUrl: RefAttachment,
  services: Services[],
  location: Locations,
  bloodType: BloodTypes,
  gender: Gender,
  driverEnterprise: string | undefined,
  pdfRef?: RefAttachment,
  policeRecordPendingByChat?: boolean,
  driverExperience?: string,
): UserRequest => {
  let userRequest: UserRequest = {
    id,
    userId,
    newFullName,
    homeAddress,
    addressPhoto,
    newProfilePhotoImgUrl,
    aproved: false,
    active: true,
    reviewedByHistory: [],
    realTimePhotoImgUrl,
    services: services,
    location,
    vehicles,
    gender,
    bloodType,
    driverExperience,
  };

  if (driverEnterprise) {
    userRequest = {
      ...userRequest,
      driverEnterprise,
    };
  }

  if (pdfRef) {
    userRequest = {
      ...userRequest,
      policeRecordsPdf: pdfRef,
    };
  }

  if (policeRecordPendingByChat) {
    userRequest = {
      ...userRequest,
      policeRecordPendingByChat,
    };
  }

  return userRequest;
};

export const emptyDriveReq = (): UserRequest => {
  return {
    id: "",
    userId: "",
    newFullName: "",
    homeAddress: "",
    addressPhoto: EMPTY_REF_ATTACHMENT,
    newProfilePhotoImgUrl: EMPTY_REF_ATTACHMENT,
    aproved: false,
    active: true,
    reviewedByHistory: [],
    realTimePhotoImgUrl: EMPTY_REF_ATTACHMENT,
    services: [],
    location: Locations.CochabambaBolivia,
    vehicles: [],
    driverEnterprise: "",
  };
};

export const mechanicReqBuilder = (
  id: string,
  userId: string,
  newFullName: string,
  homeAddress: string,
  addressPhoto: string | RefAttachment,
  newProfilePhotoImgUrl: string | RefAttachment,
  realTimePhotoImgUrl: RefAttachment,
  services: Services[],
  location: Locations,
  mechanicalWorkShop: string | undefined,
  mechanicTools: string,
  mechanicSubServices: MechanicSubService[],
  mechanicToolEvidences: MechanicToolEvidence[],
  mechanicTechnicalTitle?: TechnicalTitleEvidence,
  mechanicExperience?: string,
  isMechanicUpdateRequest?: boolean,
): UserRequest => {
  let mechanicReq: UserRequest = {
    id,
    userId,
    newFullName,
    homeAddress,
    addressPhoto,
    newProfilePhotoImgUrl,
    aproved: false,
    active: true,
    reviewedByHistory: [],
    realTimePhotoImgUrl,
    services: services,
    location,
    mechanicTools,
    mechanicSubServices,
    mechanicToolEvidences,
    mechanicExperience,
    isMechanicUpdateRequest,
  };

  if (mechanicalWorkShop) {
    mechanicReq = {
      ...mechanicReq,
      mechanicalWorkShop,
    };
  }

  if (mechanicTechnicalTitle) {
    mechanicReq = {
      ...mechanicReq,
      mechanicTechnicalTitle,
    };
  }

  return mechanicReq;
};

export const laundryReqBuilder = (
  id: string,
  userId: string,
  newFullName: string,
  homeAddress: string,
  addressPhoto: string | RefAttachment,
  newProfilePhotoImgUrl: string | RefAttachment,
  realTimePhotoImgUrl: RefAttachment,
  services: Services[],
  location: Locations,
  laundryEnterprite: string,
): UserRequest => {
  return {
    id,
    userId,
    newFullName,
    homeAddress,
    addressPhoto,
    newProfilePhotoImgUrl,
    aproved: false,
    active: true,
    reviewedByHistory: [],
    realTimePhotoImgUrl,
    services: services,
    location,
    laundryEnterprite,
  };
};

export const towReqBuilder = (
  id: string,
  userId: string,
  newFullName: string,
  homeAddress: string,
  addressPhoto: string | RefAttachment,
  newProfilePhotoImgUrl: string | RefAttachment,
  towEnterprite: string,
  realTimePhotoImgUrl: RefAttachment,
  services: Services[],
  location: Locations,
  vehicles: Vehicle[],
  pdfRef: RefAttachment,
  towVehiclePhoto?: RefAttachment,
  towExperience?: string,
): UserRequest => {
  let towReq: UserRequest = {
    id,
    userId,
    newFullName,
    homeAddress,
    addressPhoto,
    newProfilePhotoImgUrl,
    aproved: false,
    active: true,
    reviewedByHistory: [],
    realTimePhotoImgUrl,
    services: services,
    location,
    towEnterprite: towEnterprite,
    vehicles,
    policeRecordsPdf: pdfRef,
    towExperience,
  };

  if (towVehiclePhoto) {
    towReq = {
      ...towReq,
      towVehiclePhoto,
    };
  }

  return towReq;
};
