import { InputState } from "../InputValidator";

export const isValidWorkshopName = (name: string): InputState => {
    const nameRegex: RegExp = /^[a-zA-Z\s]+$/;

    if (name.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar el nombre del taller",
        };
    } else if (!nameRegex.test(name)) {
        return {
            isValid: false,
            message: "El nombre solo puede contener letras del alfabeto",
        };
    } else {
        return {
            isValid: true,
            message: "Nombre valido",
        };
    }
};
