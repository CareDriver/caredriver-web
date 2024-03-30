import { VehicleTransmission, VehicleType } from "@/interfaces/VehicleInterface";

export interface PersonalData {
    fullname: string;
    photo: string | null;
}

export interface License {
    number: string;
    expirationDate: Date;
    frontPhoto: string | null;
    behindPhoto: string | null;
}

export interface Vehicle {
    type: CarType | MotorcycleType;
    license: License;
}

export interface MotorcycleType {
    type: VehicleType.MOTORCYCLE;
}

export interface CarType {
    type: VehicleType.CAR;
    mode: VehicleTransmission;
}

export const carModes = [VehicleTransmission.AUTOMATIC, VehicleTransmission.MECHANICAL];

export const vehiclesTypes = [VehicleType.CAR, VehicleType.MOTORCYCLE];

export const defaultLicense: License = {
    number: "",
    expirationDate: new Date(),
    frontPhoto: null,
    behindPhoto: null,
};
