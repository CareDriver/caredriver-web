import { DRIVER_PLURAL } from "@/models/Business";
import { toCapitalize } from "@/utils/text_helpers/TextFormatter";

export const ENTERPRISE_TO_SPANISH_AS_PLURAL = {
  tow: "Empresas de Operadoras Grúa",
  mechanical: "Talleres Mecánicos",
  driver: `Empresas de ${toCapitalize(DRIVER_PLURAL)}`,
  laundry: "Lavaderos Creados",
};

export const ENTERPRISE_TO_SPANISH = {
  mechanical: "taller mecánico",
  tow: "empresa operadora de grúa",
  laundry: "lavadero de vehículos",
  driver: `empresa de ${DRIVER_PLURAL}`,
};

export const ENTERPRISE_TO_SPANISH_WITH_DEFINITE_ARTICLE = {
  mechanical: "el taller mecánico",
  tow: "la empresa operadora de grúa",
  laundry: "el lavadero de vehículos",
  driver: `la empresa de ${DRIVER_PLURAL}`,
};

export const ENTERPRISE_TO_SPANISH_WITH_UNDEFINITE_ARTICLE = {
  mechanical: "un taller mecánico",
  tow: "una empresa operadora de grúa",
  laundry: "un lavadero de vehículos",
  driver: `una empresa de ${DRIVER_PLURAL}`,
};

export const ENTERPRISE_TO_SPANISH_WITH_PROPOSITION_AND_ARTICLE = {
  mechanical: "del taller mecánico",
  tow: "de la empresa operadora de grúa",
  laundry: "del lavadero de vehículos",
  driver: `de la empresa de ${DRIVER_PLURAL}`,
};
