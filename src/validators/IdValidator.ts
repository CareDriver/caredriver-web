import { InputState } from "@/validators/InputValidatorSignature";
import { isNullOrEmptyText } from "@/validators/TextValidator";

const FAKE_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

export function validateId(input: string): InputState {
    if (isNullOrEmptyText(input)) {
        return {
            message: "Introduce el ID",
            isValid: false,
        };
    } else if (!FAKE_ID_REGEX.test(input)) {
        return {
            message: "ID invalido",
            isValid: false,
        };
    } else {
        return {
            message: "ID valido",
            isValid: true,
        };
    }
}
