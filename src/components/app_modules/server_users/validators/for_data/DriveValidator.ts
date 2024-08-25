import { InputState } from "../../../../../validators/InputValidatorSignature";

export const isValidLicenseNumber = (licenseNumber: string): InputState => {
    const regex: RegExp = /^[a-zA-Z0-9]+$/;
    if (licenseNumber.trim().length === 0) {
        return {
            isValid: false,
            message: "Tienes que ingresar el número de tu licencia",
        };
    } else if (!regex.test(licenseNumber)) {
        return {
            isValid: false,
            message:
                "El número de licencia no puede contener caracteres especiales ni espacios",
        };
    } else if (licenseNumber.length > 50) {
        return {
            isValid: false,
            message:
                "No puedes ingresar más de 50 caracteres para el número de licencia",
        };
    } else {
        return {
            isValid: true,
            message: "Número de licencia válido",
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
