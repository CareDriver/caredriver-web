import { InputState } from "../../../../../validators/InputValidatorSignature";

export const isValidMechanicTools = (tools: string): InputState => {
    const nameRegex: RegExp = /^\S[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s,.-]+$/;

    if (tools.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar tus herramientas de trabajo",
        };
    } else if (!nameRegex.test(tools)) {
        return {
            isValid: false,
            message: "No puedes ingresar caracteres especiales que no sean ,.-",
        };
    } else if (tools.length > 500) {
        return {
            isValid: false,
            message:
                "No puedes ingresar mas de 500 caracteres para describir tus herramientas de trabajo",
        };
    } else {
        return {
            isValid: true,
            message: "Herramientas validas",
        };
    }
};
