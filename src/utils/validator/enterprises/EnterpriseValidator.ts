import { InputState } from "../InputValidator";

export const isValidWorkshopName = (name: string): InputState => {
    const nameRegex: RegExp = /^[a-zA-Z\d\s]+$/;

    if (name.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar el nombre del taller",
        };
    } else if (!nameRegex.test(name)) {
        return {
            isValid: false,
            message: "El nombre solo puede contener letras del alfabeto y numeros",
        };
    } else {
        return {
            isValid: true,
            message: "Nombre valido",
        };
    }
};
