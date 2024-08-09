import { InputState } from "@/utils/validator/InputValidator";
import { isNullOrEmptyText } from "@/utils/validator/text/TextValidator";

const FAKE_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

export function validateFakeId(input: string): InputState {
    if (isNullOrEmptyText(input)) {
        return {
            message: "Introduce el ID del servicio",
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
