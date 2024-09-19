import { MAX_LENGTH_FOR_NAMES } from "@/utils/text_helpers/TextCutter";
import { InputState } from "../../../../validators/InputValidatorSignature";

export const validateEnterpriseName = (name: string): InputState => {
    const nameRegex: RegExp = /^\S[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

    if (name.trim() === "") {
        return {
            isValid: false,
            message: "Ingresa el nombre de la Empresa",
        };
    } else if (!nameRegex.test(name)) {
        return {
            isValid: false,
            message:
                "El nombre solo puede contener letras del alfabeto y números",
        };
    } else if (name.length > MAX_LENGTH_FOR_NAMES) {
        return {
            isValid: false,
            message:
                `No puedes ingresar mas de ${MAX_LENGTH_FOR_NAMES} caracteres para el nombre de la Empresa`,
        };
    } else {
        return {
            isValid: true,
            message: "Nombre valido",
        };
    }
};
