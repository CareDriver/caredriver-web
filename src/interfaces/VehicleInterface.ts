import { Timestamp } from "firebase/firestore";

export enum VehicleType {
    CAR = "car",
    MOTORCYCLE = "motorcycle",
}

export enum VehicleTransmission {
    AUTOMATIC = "automatic",
    MECHANICAL = "mechanical",
}

export enum VehicleSize {
    BIG = "big",
    MEDIUM = "medium",
    SMALL = "small",
    MOTORCYCLE = "motorcycle"
}

export interface VehicleInterface {
    id: number; // Id of the vehicle
    name: string; // The name of the vehicle
    description: string; // Description or details about the vehicle
    type: VehicleType; // Type of the vehicle, either 'car' or 'motorcycle'
    transmission?: VehicleTransmission; // Type of transmission, either 'automatic' or 'mechanical'
    usedTimes: number; // Number of trips vehicle was used
    size?: VehicleSize;
}

export const getVehicleSizeLabel = {
    [VehicleSize.BIG]: "Grande",
    [VehicleSize.MEDIUM]: "Mediano",
    [VehicleSize.SMALL]: "Pequeño",
    [VehicleSize.MOTORCYCLE]: "Moto",
}

// Object of an empty new vehicle to add
export const newVehicle = (): VehicleInterface => {
    return {
        id: Timestamp.now().toMillis(),
        name: "",
        description: "",
        type: VehicleType.CAR,
        size: VehicleSize.MEDIUM,
        transmission: VehicleTransmission.AUTOMATIC,
        usedTimes: 0,
    };
};

type VehicleTypeOption = {
    value: VehicleType;
    label: string;
    icon: string;
    checkedColor: string;
};

type VehicleSizeOption = {
    value: VehicleSize;
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
    { value: VehicleType.CAR, label: "Auto", icon: "car", checkedColor: "#FFF" },
    { value: VehicleType.MOTORCYCLE, label: "Moto", icon: "motorbike", checkedColor: "#FFF" },
];

// Vehicle sizes to render
export const vehicleSizes: VehicleSizeOption[] = [
    { value: VehicleSize.SMALL, title: "Pequeño", icon: "car-sports" },
    { value: VehicleSize.MEDIUM, title: "Mediano", icon: "car-hatchback" },
    { value: VehicleSize.BIG, title: "Grande", icon: "car-estate" },
];

// Vehicle tarnsmissions to render
export const vehicleTransmissions: VehicleTransmissionOption[] = [
    { value: VehicleTransmission.AUTOMATIC, title: "Automático" },
    { value: VehicleTransmission.MECHANICAL, title: "Mecánico" },
];