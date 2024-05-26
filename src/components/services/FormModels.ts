import { VehicleTypeAndMode } from "@/interfaces/UserRequest";
import { VehicleTransmission, VehicleType } from "@/interfaces/VehicleInterface";

export interface PersonalData {
    fullname: string | undefined;
    photo: string | undefined | null;
}

export interface PhotoField {
    value: string | null;
    message: string | null;
}

export const defaultPhoto: PhotoField = {
    value: null,
    message: null,
};

export interface PersonalDataFormField {
    fullname: {
        value: string;
        message: string | null;
    };
    photo: PhotoField;
    idCard: IdCardForm;
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
    type: VehicleTypeAndMode;
    license: LicenseForm;
}

export const vehiclesModes = [VehicleTransmission.AUTOMATIC, VehicleTransmission.MECHANICAL];

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

export interface EnterpriseField {
    value: string | null;
    message: string | null;
}

export interface IdCardForm {
    frontCard: PhotoField;
    backCard: PhotoField;
    location: {
        value: string;
        message: string | null;
    };
}

export interface FieldStringForm {
    value: string;
    message: string | null;
}