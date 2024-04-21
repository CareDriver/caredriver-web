import { PersonalDataFormField, VehicleForm } from "@/components/services/FormModels";
import { InputState } from "../InputValidator";
import { PhotoField } from "@/components/services/FormModels";

export const isValidLicenseNumber = (licenseNumber: string): InputState => {
    if (licenseNumber.trim().length === 0) {
        return {
            isValid: false,
            message: "Tienes que ingresar el numero de tu licencia",
        };
    } else if (licenseNumber.length > 50) {
        return {
            isValid: false,
            message: "No puedes ingresar mas de 50 caracteres para el numero de licensia",
        };
    } else {
        return {
            isValid: true,
            message: "Fecha válida",
        };
    }
};

export const isValidLicenseDate = (finalDate: Date): InputState => {
    const currentDate = new Date();

    if (
        finalDate < currentDate ||
        finalDate.toDateString() === currentDate.toDateString()
    ) {
        return {
            isValid: false,
            message: "La fecha de su licencia ya expiro",
        };
    } else {
        return {
            isValid: true,
            message: "Fecha válida",
        };
    }
};

export const isValidForm = (
    personalData: PersonalDataFormField,
    vehicles: VehicleForm[],
    userConfirmation: PhotoField,
    acceptedTerms: boolean,
): boolean => {
    var isValid = !personalData.fullname.message && !personalData.photo.message;

    if (isValid) {
        vehicles.forEach((vehicle) => {
            if (isValid) {
                isValid =
                    !vehicle.license.number.message &&
                    !vehicle.license.expirationDate.message &&
                    !vehicle.license.behindPhoto.message &&
                    !vehicle.license.frontPhoto.message;
            } else {
                return isValid;
            }
        });
    }

    if (isValid) {
        isValid = !userConfirmation.message && acceptedTerms;
    }

    return isValid;
};

export const verifyNoEmptyData = (
    personalData: PersonalDataFormField,
    vehicles: VehicleForm[],
    userConfirmation: PhotoField,
    acceptedTerms: boolean,
): boolean => {
    var isNotEmpty =
        personalData.fullname.value.trim().length > 0 &&
        personalData.photo.value !== null;

    if (isNotEmpty) {
        vehicles.forEach((vehicle) => {
            if (isNotEmpty) {
                isNotEmpty =
                    vehicle.license.number.value.trim().length > 0 &&
                    vehicle.license.expirationDate.value !== null &&
                    vehicle.license.behindPhoto.value !== null &&
                    vehicle.license.frontPhoto.value !== null;
            } else {
                return false;
            }
        });
    }

    if (isNotEmpty) {
        isNotEmpty = userConfirmation.value !== null && acceptedTerms;
    }

    return isNotEmpty;
};
