import { PhoneNumberUtil } from "google-libphonenumber";
import { InputState } from "../InputValidator";

export const isValidName = (name: string): InputState => {
    const nameRegex: RegExp = /^[a-zA-Z\s]+$/;

    if (name.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar un nombre completo",
        };
    } else if (!nameRegex.test(name)) {
        return {
            isValid: false,
            message: "Tu nombre solo puede contender letras del alfabeto",
        };
    } else {
        return {
            isValid: true,
            message: "Nombre valido",
        };
    }
};

export const isValidEmail = (email: string): InputState => {
    const emailRegex: RegExp =
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    if (email.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar tu correo",
        };
    } else if (!emailRegex.test(email)) {
        return {
            isValid: false,
            message:
                'Por favor ingresa un correo con el formato "example@example.example"',
        };
    } else {
        return { isValid: true, message: "Campo valido" };
    }
};

export const isValidPassword = (password: string): InputState => {
    if (password.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar tu contraseña",
        };
    } else if (password.length < 6) {
        return {
            isValid: false,
            message: "Tu contraseña deberia tener al menos 6 caracteres",
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
        var isValid = phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
        return {
            isValid: isValid,
            message: isValid ? "Numero valido" : "Numero invalido",
        };
    } catch (error) {
        return {
            isValid: false,
            message: "Numero invalido",
        };
    }
};
