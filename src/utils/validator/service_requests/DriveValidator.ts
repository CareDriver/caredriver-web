import { InputState } from "../InputValidator";

export const isValidLicenseDate = (finalDate: Date): InputState => {
    const currentDate = new Date();

    if (finalDate <= currentDate) {
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
