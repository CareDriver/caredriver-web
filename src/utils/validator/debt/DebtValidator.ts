import { InputState } from "../InputValidator";

export const isValidAmount = (num: string, current: number | undefined): InputState => {
    const regex: RegExp = /^[0-9]+(\.[0-9]+)?$/;

    if (num.trim() === "") {
        return {
            isValid: false,
            message: "Tienes que ingresar el nuevo monto de deuda",
        };
    } else if (!regex.test(num)) {
        return {
            isValid: false,
            message: "Ingresa solo numeros por favor",
        };
    } else if (current && parseFloat(num) > current) {
        return {
            isValid: false,
            message: "El monto pagado no puede ser mayor a su deuda actual",
        };
    } else if (num.length > 150) {
        return {
            isValid: false,
            message: "Nuevo monto invalido",
        };
    } else {
        return {
            isValid: true,
            message: "Monto valido",
        };
    }
};
