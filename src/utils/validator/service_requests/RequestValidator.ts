import { InputState } from "../InputValidator";

export const validateFullName = (fullName: string): InputState => {
    const nameRegex: RegExp = /^[a-zA-Z\s]+$/;

    if (fullName.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar un nombre completo",
        };
    } else if (!nameRegex.test(fullName)) {
        return {
            isValid: false,
            message: "Tu nombre solo puede contender letras del alfabeto y espacios",
        };
    } else {
        return {
            isValid: true,
            message: "Nombre valido",
        };
    }
};
