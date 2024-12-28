import { InputState } from "@/validators/InputValidatorSignature";

export function isValidDebtPaid(
    currentDebt: number,
    paidDebt: string,
): InputState {
    const regex: RegExp = /^-?\d+(\.\d+)?$/;

    if (paidDebt.trim() === "") {
        return {
            isValid: false,
            message: "Ingresar el monto para pagar la deuda",
        };
    } else if (!regex.test(paidDebt)) {
        return {
            isValid: false,
            message: "Monto invalido",
        };
    } else if (parseFloat(paidDebt) > currentDebt) {
        return {
            isValid: false,
            message: `El monto de no debe ser mayor que la deuda actual`,
        };
    } else if (parseFloat(paidDebt) < 1) {
        return {
            isValid: false,
            message: `El monto debe ser mayor a cero`,
        };
    } else {
        return {
            isValid: true,
            message: "Monto valido",
        };
    }
}

export function isValidNote(note: string): InputState {
    const reasonRegex: RegExp = /^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ.,;:!?()\'\"\s-]+$/;
    const MAX_LENGTH = 250;

    if (!reasonRegex.test(note)) {
        return {
            isValid: false,
            message: "Nota invalida",
        };
    } else if (note.length > MAX_LENGTH) {
        return {
            isValid: false,
            message: `No puedes ingresar mas de ${MAX_LENGTH} caracteres para la nota`,
        };
    } else {
        return {
            isValid: true,
            message: "Nota valida",
        };
    }
}
