import { MAX_LENGTH_FOR_NAMES } from "@/utils/text_helpers/TextCutter";
import { InputState } from "@/validators/InputValidatorSignature";
import { PhoneNumberUtil } from "google-libphonenumber";

export const isValidName = (name: string): InputState => {
    const nameRegex: RegExp = /^\S[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

    if (name.trim() === "") {
        return {
            isValid: false,
            message: "Por favor, ingresa tu nombre completo",
        };
    } else if (!nameRegex.test(name)) {
        return {
            isValid: false,
            message: "Por favor, ingresa un nombre valido",
        };
    } else if (name.length > MAX_LENGTH_FOR_NAMES) {
        return {
            isValid: false,
            message: `No puedes ingresar mas de ${MAX_LENGTH_FOR_NAMES} caracteres para tu nombre`,
        };
    } else {
        return {
            isValid: true,
            message: "Nombre valido",
        };
    }
};

export const isValidEmail = (email: string): InputState => {
    const emailRegex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    if (email.trim() === "") {
        return {
            isValid: false,
            message: "Por favor, ingresa tu correo electrónico",
        };
    } else if (!emailRegex.test(email)) {
        return {
            isValid: false,
            message:
                'Por favor, ingresa un correo electrónico en el formato "nombre@dominio."',
        };
    } else if (email.length > 320) {
        return {
            isValid: false,
            message: "No puedes ingresar mas de 320 caracteres para tu correo",
        };
    } else {
        return { isValid: true, message: "Campo valido" };
    }
};

export const isValidEmailFrom = (emailFrom: {
    value: string;
    message: string | null;
}): boolean => {
    return (
        emailFrom.message === null &&
        emailFrom.value.length > 0 &&
        emailFrom.value.trim().length > 0
    );
};

export const isValidPassword = (password: string): InputState => {
    if (password.trim() === "") {
        return {
            isValid: false,
            message: "Por favor, ingresa una contraseña",
        };
    } else if (password.length < 6) {
        return {
            isValid: false,
            message: "Tu contraseña debe tener al menos 6 caracteres",
        };
    } else if (password.length > 150) {
        return {
            isValid: false,
            message:
                "No puedes ingresar mas de 150 caracteres para tu contraseña",
        };
    } else {
        return {
            isValid: true,
            message: "Campo valido",
        };
    }
};

export const isPhoneValid = (phone: string): InputState => {
    const phoneUtil = PhoneNumberUtil.getInstance();

    try {
        var isValid = phoneUtil.isValidNumber(
            phoneUtil.parseAndKeepRawInput(phone),
        );
        return {
            isValid: isValid,
            message: isValid
                ? "número válido"
                : "Por favor, ingresa un número de teléfono válido",
        };
    } catch (error) {
        return {
            isValid: false,
            message: "Por favor, ingresa un número de teléfono válido",
        };
    }
};
