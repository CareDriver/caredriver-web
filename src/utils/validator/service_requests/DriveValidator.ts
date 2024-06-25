import {
    IdCardForm,
    PersonalDataFormField,
    VehicleForm,
} from "@/components/services/FormModels";
import { InputState } from "../InputValidator";
import { PhotoField } from "@/components/services/FormModels";
import { PDFField } from "@/components/form/PDFUploader";

export const isValidLicenseNumber = (licenseNumber: string): InputState => {
    const regex: RegExp = /^[a-zA-Z0-9\s]+$/;
    if (licenseNumber.trim().length === 0) {
        return {
            isValid: false,
            message: "Tienes que ingresar el número de tu licencia",
        };
    } else if (!regex.test(licenseNumber)) {
        return {
            isValid: false,
            message: "El número de licencia no puede contener caracteres especiales",
        };
    } else if (licenseNumber.length > 50) {
        return {
            isValid: false,
            message: "No puedes ingresar mas de 50 caracteres para el número de licencia",
        };
    } else {
        return {
            isValid: true,
            message: "Fecha válida",
        };
    }
};

export const isValidTodayDate = (finalDate: Date) => {
    const currentDate = new Date();
    
}

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
    pdf: PDFField,
    idCardForm: IdCardForm,
): boolean => {
    var isValid = !personalData.fullname.message && !personalData.photo.message;

    if (isValid) {
        isValid =
            !idCardForm.backCard.message &&
            !idCardForm.frontCard.message &&
            !idCardForm.location.message;
    }

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
        isValid = !pdf.message;
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
    pdf: PDFField,
    idCardForm: IdCardForm,
): boolean => {
    var isNotEmpty =
        personalData.fullname.value.trim().length > 0 &&
        personalData.photo.value !== null;

    if (isNotEmpty) {
        isNotEmpty =
            idCardForm.backCard.value !== null &&
            idCardForm.frontCard.value !== null &&
            idCardForm.location.value.trim().length > 0;
    }

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
        isNotEmpty = pdf.value !== null;
    }

    if (isNotEmpty) {
        isNotEmpty = userConfirmation.value !== null && acceptedTerms;
    }

    return isNotEmpty;
};
