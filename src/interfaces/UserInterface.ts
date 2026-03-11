import { GeoPoint, Timestamp } from "firebase/firestore";
import { VehicleInterface } from "./VehicleInterface";
import { ServiceReqState, Services } from "./Services";
import { ServicesData } from "./ServicesDataInterface";
import { BalanceHistory, ExpirationBalance, Price } from "./Payment";
import { Locations } from "./Locations";
import { ServiceStateRequest, Vehicle } from "./UserRequest";
import {
  EMPTY_REF_ATTACHMENT,
  RefAttachment,
} from "../components/form/models/RefAttachment";
import { Branding } from "./BrandingInterface";
import { BloodTypes } from "./BloodTypes";

export interface HistoryLocationInterface {
  latitude?: number;
  longitude?: number;
  locationName: string;
  // This interface was created for in the future add more attributes or options for users to save their locations, for example custom names as "Home", etc
  coordinates: GeoPoint | null; // Geographical coordinates for a location
}

export interface HistoryReadLocationInterface {
  locationName: string;
  // This interface was created for in the future add more attributes or options for users to save their locations, for example custom names as "Home", etc
  coordinates: {
    _lat: number | undefined;
    _long: number | undefined;
  }; // Geographical coordinates for a location
}

export enum UserRole {
  User = "User",
  Admin = "Admin",
  Support = "Support",
  SupportTwo = "SupportTwo",
  BalanceRecharge = "BalanceRecharge",
}

export const USER_ROLE_TO_SPANISH = {
  User: "Usuario",
  Admin: "Administrador",
  Support: "Soporte",
  SupportTwo: "Soporte Dos",
  BalanceRecharge: "Recargador de Saldo",
};

export const userRoles = [
  UserRole.User,
  UserRole.BalanceRecharge,
  UserRole.Support,
  UserRole.SupportTwo,
  UserRole.Admin,
];

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface UserInterface {
  id?: string; // Unique identifier for the user
  fakeId?: string;
  role?: UserRole; // the role that the user has in the application
  fullName: string; // Full name of the user
  gender?: Gender; // Gender of the user
  fullNameArrayLower?: string[]; // Array with full name separated by words ej: ["nombre", "apellido"]
  homeAddress: string; // Home address of the user
  addressPhoto: RefAttachment; // attachment of the "factura de luz"
  bloodType?: BloodTypes; // mandatory for drivers
  phoneNumber: PhoneNumber; // Phone number of the user (includes country code, ej: +591 76543218)
  lastPhoneVerification: Timestamp; // Last time the phone number was verified
  alternativePhoneNumberName?: string;
  alternativePhoneNumber?: PhoneNumber;
  photoUrl: RefAttachment; // URL of the user's photo
  email?: string; // User's email
  identityCard?: IdentityCard; // User's Id card
  policeRecordsPdf?: RefAttachment; // Police records PDF for service providers

  // comments: string[]; // Array of comments given by drivers
  vehicles: VehicleInterface[]; // Array of vehicles associated with the user
  services: Services[]; // The services the user can provide, just "normal" if it's a non-service user

  servicesData: ServicesData; // The comments and rating per service for the user
  pickUpLocationsHistory: HistoryLocationInterface[]; // Array of historical pickup locations
  deliveryLocationsHistory: HistoryLocationInterface[]; // Array of historical delivery locations

  balance: Price; // current debt of a server user towards the application, will contain the money that the user owes to the application following the services made and last time he/she paid
  minimumBalance: Price;
  balanceHistory?: BalanceHistory[]; // Array of the payments made by the service user to the app.
  balanceWithExpiration?: ExpirationBalance; // Valid balance until a given date

  location?: Locations; // Location user begins
  disable?: boolean; // true when user did not paid to the app and was disabled.
  disabledUntil?: Timestamp;
  deleted: boolean; // used for soft delete
  driverEnterpriseId?: string;
  mechanicalWorkShopId?: string; // id of the mechanical user works for if is mechanic user
  towEnterpriseId?: string; // id of the tow enterprise user works for if is tow user
  laundryEnterpriseId?: string; // id of the tow enterprise user works for if is tow user

  serviceVehicles?: ServiceVehicles; // vehicles that the user registered
  serviceRequests?: ServiceRequestsInterface; // status of the services that the user made a request

  branding?: Branding;
  createdAt?: Timestamp;
  serverUserAt?: Timestamp;
}

export interface PhoneNumber {
  countryCode: string;
  number: string;
}

export const DEFAULT_PHONE: PhoneNumber = {
  countryCode: "",
  number: "",
};

export const flatPhone = (phone: PhoneNumber | undefined | null): string => {
  if (phone === undefined || phone === null || phone.number === "") {
    return "";
  }

  return phone.countryCode + " " + phone.number;
};

export interface IdentityCard {
  frontCard: RefAttachment;
  backCard: RefAttachment;
  location: string;
  updatedDate: Timestamp;
}

export const emptyIdCard: IdentityCard = {
  frontCard: EMPTY_REF_ATTACHMENT,
  backCard: EMPTY_REF_ATTACHMENT,
  location: "",
  updatedDate: Timestamp.now(),
};

export interface ServiceRequestsInterface {
  driveCar?: ServiceStateRequest;
  driveMotorcycle?: ServiceStateRequest;
  mechanic?: ServiceStateRequest;
  tow?: ServiceStateRequest;
  laundry?: ServiceStateRequest;
}

export interface ServiceVehicles {
  car?: Vehicle;
  motorcycle?: Vehicle;
  tow?: Vehicle;
}

export const defaultServiceReq = {
  driveCar: {
    id: "",
    state: ServiceReqState.NotSent,
  },
  driveMotorcycle: {
    id: "",
    state: ServiceReqState.NotSent,
  },
  mechanic: {
    id: "",
    state: ServiceReqState.NotSent,
  },
  tow: {
    id: "",
    state: ServiceReqState.NotSent,
  },
  laundry: {
    id: "",
    state: ServiceReqState.NotSent,
  },
};

export interface ServiceRequest {
  type: Services;
  state: ServiceReqState;
}

export interface UserQuery {
  vehicles: VehicleInterface[];
  pickUpLocationsHistory?: HistoryReadLocationInterface[];
  deliveryLocationsHistory?: HistoryReadLocationInterface[];
}
