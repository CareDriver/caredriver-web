import { VehicleTransmission, VehicleType } from "@/interfaces/VehicleInterface";
import { defaultPhoto, PhotoField } from "@/components/services/FormModels";
import { CarType, MotorcycleType } from "@/interfaces/UserRequest";

export interface PersonalData {
    fullname: {
        value: string;
        message: string | null;
    };
    photo: PhotoField;
}

export interface LicenseForm {
    number: {
        value: string;
        message: string | null;
    };
    expirationDate: {
        value: Date | null;
        message: string | null;
    };
    frontPhoto: PhotoField;
    behindPhoto: PhotoField;
}

export interface VehicleForm {
    type: CarType | MotorcycleType;
    license: LicenseForm;
}

export const carModes = [VehicleTransmission.AUTOMATIC, VehicleTransmission.MECHANICAL];

export const vehiclesTypes = [VehicleType.CAR, VehicleType.MOTORCYCLE];

export const defaultLicense: LicenseForm = {
    number: {
        value: "",
        message: null,
    },
    expirationDate: {
        value: null,
        message: null,
    },
    frontPhoto: defaultPhoto,
    behindPhoto: defaultPhoto,
};
