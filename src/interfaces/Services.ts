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
    driver: "Chofer",
    mechanic: "Mecánico",
    tow: "Remolque", // servicios de grúa
    laundry: "Lavadero",
};

export enum ServiceReqState {
    Reviewing = "Reviewing",
    Refused = "Refused",
    NotSent = "NotSent",
    Approved = "Approved",
}
