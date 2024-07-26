import { Timestamp } from "firebase/firestore";

export enum VehicleType {
    CAR = "car",
    MOTORCYCLE = "motorcycle",
}

export enum VehicleTransmission {
    AUTOMATIC = "automatic",
    MECHANICAL = "mechanical",
}

export interface VehicleInterface {
    id: number; // Id of the vehicle
    name: string; // The name of the vehicle
    description: string; // Description or details about the vehicle
    type: VehicleType; // Type of the vehicle, either 'car' or 'motorcycle'
    transmission?: VehicleTransmission; // Type of transmission, either 'automatic' or 'mechanical'
    usedTimes: number; // Number of trips vehicle was used
}

// Object of an empty new vehicle to add
export const newVehicle = (): VehicleInterface => {
    return {
        id: Timestamp.now().toMillis(),
        name: "",
        description: "",
        type: VehicleType.CAR,
        transmission: VehicleTransmission.AUTOMATIC,
        usedTimes: 0,
    };
};

type VehicleTypeOption = {
    value: VehicleType;
    title: string;
    icon: string;
};

type VehicleTransmissionOption = {
    value: VehicleTransmission;
    title: string;
};

export const vehicleTypeRender = {
    car: "Automóvil",
    motorcycle: "Motocicleta",
    tow: "Grúa",
};

export const vehicleTypeRenderV2 = {
    car: "del automóvil",
    motorcycle: "de la motocicleta",
    tow: "de la grúa",
};

export const vehicleModeRender = {
    automatic: "automático",
    mechanical: "mecánico",
};

export const vehicleModeRenderV2 = {
    automatic: "automática",
    mechanical: "mecánica",
};

// Vehicle types to render
export const vehicleTypes: VehicleTypeOption[] = [
    { value: VehicleType.CAR, title: "Auto", icon: "car" },
    { value: VehicleType.MOTORCYCLE, title: "Moto", icon: "motorbike" },
];

// Vehicle tarnsmissions to render
export const vehicleTransmissions: VehicleTransmissionOption[] = [
    { value: VehicleTransmission.AUTOMATIC, title: "Automático" },
    { value: VehicleTransmission.MECHANICAL, title: "Mecánico" },
];
