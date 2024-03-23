import { Timestamp } from "firebase/firestore";

export interface VehicleInterface {
    id: number; // Id of the vehicle
    name: string; // The name of the vehicle
    description: string; // Description or details about the vehicle
    type: "car" | "motorcycle"; // Type of the vehicle, either 'car' or 'motorcycle'
    transmission?: "automatic" | "mechanical"; // Type of transmission, either 'automatic' or 'mechanical'
    usedTimes: number; // Number of trips vehicle was used
}

// Object of an empty new vehicle to add
export const newVehicle = (): VehicleInterface => {
    return {
        id: Timestamp.now().toMillis(),
        name: "",
        description: "",
        type: "car",
        transmission: "automatic",
        usedTimes: 0,
    };
};
// Vehicle types to render
export const vehicleTypes = [
    { value: "car", title: "Auto", icon: "car" },
    { value: "motorcycle", title: "Moto", icon: "motorbike" },
];

// Vehicle transmissions to render
export const vehicleTranmissions = [
    { value: "automatic", title: "Automático" },
    { value: "mechanical", title: "Mecánico" },
];
