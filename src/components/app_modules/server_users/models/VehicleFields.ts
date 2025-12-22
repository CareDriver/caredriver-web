import { VehicleTypeAndMode } from "@/interfaces/UserRequest";
import { DEFAULT_LICENSE, License } from "./LicenseFields";
import {
  VehicleTransmission,
  VehicleType,
} from "@/interfaces/VehicleInterface";

export interface Vehicle {
  type: VehicleTypeAndMode;
  license: License;
}

export interface EnterpriseField {
  value: string | null;
  message: string | null;
}

export interface FieldStringForm {
  value: string;
  message: string | null;
}

export const DEFAULT_VEHICLE: Vehicle = {
  type: {
    type: VehicleType.CAR,
    mode: [VehicleTransmission.AUTOMATIC],
  },
  license: DEFAULT_LICENSE,
};

export const VEHICLE_TRANSMISSIONS = [
  VehicleTransmission.AUTOMATIC,
  VehicleTransmission.MECHANICAL,
];

export const VEHICLE_CATEGORIES = [VehicleType.CAR, VehicleType.MOTORCYCLE];

// to rendering:
export const VEHICLE_CATEGORY_TO_SPANISH = {
  car: "Automóvil",
  motorcycle: "Motocicleta",
  tow: "Grúa",
};

export const VEHICLE_CATEGORY_TO_SPANISH_WITH_ARTICLE = {
  car: "del automóvil",
  motorcycle: "de la motocicleta",
  tow: "de la grúa",
};

export const TRANSMITION_TO_SPANISH = {
  automatic: "automático",
  mechanical: "mecánico",
};

export const TRANSMITION_TO_SPANISH_V2 = {
  automatic: "automática",
  mechanical: "mecánica",
};
