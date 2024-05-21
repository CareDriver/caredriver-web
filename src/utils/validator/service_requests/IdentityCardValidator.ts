import { InputState } from "../InputValidator";

export const isValidLocationName = (name: string): InputState => {
    const nameRegex: RegExp = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ .,-]+$/;

    if (name.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar la localizacion de donde naciste",
        };
    } else if (!nameRegex.test(name)) {
        return {
            isValid: false,
            message: "La localizacion no puede contener simbolos especiales que no sean . , -",
        };
    } else if (name.length > 200) {
        return {
            isValid: false,
            message: "No puedes ingresar mas de 200 caracteres para la localizacion",
        };
    } else {
        return {
            isValid: true,
            message: "Localizacion valido",
        };
    }
};
