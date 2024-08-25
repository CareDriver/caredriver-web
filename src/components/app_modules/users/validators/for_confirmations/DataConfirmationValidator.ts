import { InputState } from "@/validators/InputValidatorSignature";
import { isValidEmail } from "../for_data/CredentialsValidator";

export const validateEmialWithComparison = (
    email: string,
    userEmail: string | undefined,
): InputState => {
    let emailValidated = isValidEmail(email);
    if (!emailValidated.isValid) {
        return emailValidated;
    }

    if (userEmail !== undefined && email !== userEmail) {
        return {
            isValid: false,
            message: "El correo no es el mismo que el del usuario",
        };
    } else {
        return { isValid: true, message: "Campo valido" };
    }
};
