import { InputState } from "../InputValidator";

export const isValidAmount = (num: string): InputState => {
    const regex: RegExp = /^-?\d+(\.\d+)?$/;

    if (num.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar el valor del saldo",
        };
    } else if (!regex.test(num)) {
        return {
            isValid: false,
            message: "Saldo invalido",
        };
    } else if (num.length > 150) {
        return {
            isValid: false,
            message: "Limite del saldo sobrepasado",
        };
    } else {
        return {
            isValid: true,
            message: "Monto valido",
        };
    }
};

export const isValidBankNumber = (number: string): InputState => {
    const numberBankRegex: RegExp = /^[A-Za-z0-9]{8,12}$/;

    if (number.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar el número de transaccion",
        };
    } else if (!numberBankRegex.test(number)) {
        return {
            isValid: false,
            message: "Número de transaccion invalido",
        };
    } else if (number.length > 100) {
        return {
            isValid: false,
            message:
                "No puedes ingresar mas de 100 caracteres para el número de transaccion",
        };
    } else {
        return {
            isValid: true,
            message: "Numero valido",
        };
    }
};

export const isValidChangeReason = (reason: string): InputState => {
    const reasonRegex: RegExp = /^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ.,;:!?()\'\"\s-]+$/;

    if (reason.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar tu justificatorio por favor",
        };
    } else if (!reasonRegex.test(reason)) {
        return {
            isValid: false,
            message: "Justificacion invalida",
        };
    } else if (reason.length > 500) {
        return {
            isValid: false,
            message: "No puedes ingresar mas de 500 caracteres para tu justificatorio",
        };
    } else {
        return {
            isValid: true,
            message: "Justificatorio valido",
        };
    }
};

export const isValidComplainId = (reason: string): InputState => {
    const reasonRegex: RegExp = /^[A-Za-z0-9_-]+$/;

    if (reason.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar un ID de queja por favor",
        };
    } else if (!reasonRegex.test(reason)) {
        return {
            isValid: false,
            message: "ID de queja invalido",
        };
    } else if (reason.length > 100) {
        return {
            isValid: false,
            message: "El ID no puede tener mas de 100 caracteres",
        };
    } else {
        return {
            isValid: true,
            message: "ID valido",
        };
    }
};
