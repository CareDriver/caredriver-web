import { DRIVER } from "@/models/Business";
import { toCapitalize } from "@/utils/text_helpers/TextFormatter";

export type ServiceType = "mechanical" | "tow" | "laundry" | "driver";

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

export const ServicesRender = {
    normal: "Normal",
    driver: toCapitalize(DRIVER),
    mechanical: "Mecánico",
    tow: "Operador de Grua", // servicios de grúa
    laundry: "Lavadero",
};

export enum ServiceReqState {
    Reviewing = "Reviewing",
    Refused = "Refused",
    NotSent = "NotSent",
    Approved = "Approved",
}
