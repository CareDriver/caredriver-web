import { VehicleTransmission } from "@/interfaces/VehicleInterface";
import { differenceOnDays } from "@/utils/helpers/DateHelper";
import { TRANSMITION_TO_SPANISH_V2 } from "../models/VehicleFields";
import CarSide from "@/icons/CarSide";
import Truck from "@/icons/Truck";
import Motorcycle from "@/icons/Motorcycle";

export function getColorButtonLicense(date: Date) {
  var difference = differenceOnDays(date);
  if (difference <= 0) return "red";
  if (difference <= 7) return "yellow";
  return "green";
}

export function getTransmissionsAsSpanish(
  modes: VehicleTransmission[],
): string[] {
  return modes.map((mode) => TRANSMITION_TO_SPANISH_V2[mode]);
}

export function getVehicleIconByType(type: "car" | "motorcycle" | "tow") {
  switch (type) {
    case "car":
      return CarSide;
    case "motorcycle":
      return Motorcycle;
    case "tow":
      return Truck;
  }
}
