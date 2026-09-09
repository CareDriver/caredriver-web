import { DRIVER } from "@/models/Business";
import { toCapitalize } from "@/utils/text_helpers/TextFormatter";
import { ServicesApp } from "./ServiceRequestInterface";

export type ServiceType = "mechanical" | "tow" | "laundry" | "driver";

/** Directory-specific service types (separate to avoid breaking existing marketplace UI). */
export type DirectoryServiceType =
  | "workshop"
  | "tire_shop"
  | "body_shop"
  | "lubricant_shop"
  | "electrical_shop"
  | "auto_parts_store";

export type ExtendedServiceType = ServiceType | DirectoryServiceType;

export enum Services {
  Normal = "Normal",
  Driver = "Conductor",
  Mechanic = "Mecánico",
  Tow = "Remolque", // servicios de grúa
  Laundry = "Lavadero",
}

export enum UserServices {
  Driver = "Conductor",
  Mechanic = "Mecánico",
  Tow = "Remolque", // servicios de grúa
  Laundry = "Lavadero",
}

/** Directory-specific services (kept separate from marketplace enums). */
export enum DirectoryServices {
  Workshop = "Taller",
  TireShop = "Llantería",
  BodyShop = "Chapería",
  LubricantShop = "Lubricentro",
  ElectricalShop = "Electricidad",
  AutoPartsStore = "Repuestos",
}

export const ServicesRender = {
  normal: "Normal",
  driver: toCapitalize(DRIVER),
  mechanical: "Mecánico",
  tow: "Operador de Grua", // servicios de grúa
  laundry: "Lavadero",
  [ServicesApp.Normal]: "Normal",
  [ServicesApp.Driver]: toCapitalize(DRIVER),
  [ServicesApp.Mechanic]: "Mecánico",
  [ServicesApp.Tow]: "Operador de Grua", // servicios de grúa
  [ServicesApp.CarWash]: "Lavadero",
};

/** Render labels for directory service types. */
export const DirectoryServicesRender: Record<DirectoryServiceType, string> = {
  workshop: "Taller",
  tire_shop: "Llantería",
  body_shop: "Chapería",
  lubricant_shop: "Lubricentro",
  electrical_shop: "Electricidad",
  auto_parts_store: "Repuestos",
};

export enum ServiceReqState {
  Reviewing = "Reviewing",
  Refused = "Refused",
  NotSent = "NotSent",
  Approved = "Approved",
}
