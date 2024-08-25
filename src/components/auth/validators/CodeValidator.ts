import { InputState } from "@/validators/InputValidatorSignature";
import { isNullOrEmptyText } from "@/validators/TextValidator";

export function validateCodeOfVerification(input: string): InputState {
    if (isNullOrEmptyText(input)) {
        return {
            isValid: false,
            message: "Ingresa el codigo de verificacion",
        };
    } else {
        return {
            isValid: true,
            message: "Codigo ingresado",
        };
    }
}
