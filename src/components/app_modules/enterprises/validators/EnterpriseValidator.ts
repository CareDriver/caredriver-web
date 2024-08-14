import { UserInterface } from "@/interfaces/UserInterface";
import { InputState } from "../../../../utils/validator/InputValidator";
import { Enterprise } from "@/interfaces/Enterprise";

export const validateConfirmationEnterpriseName = (
    name: string,
    enterpriseName: string,
): InputState => {
    const nameRegex: RegExp = /^\S[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

    if (name.trim() === "") {
        return {
            isValid: false,
            message: "Ingresa el nombre de la Empresa",
        };
    } else if (!nameRegex.test(name)) {
        return {
            isValid: false,
            message:
                "El nombre solo puede contener letras del alfabeto y números",
        };
    } else if (name.length > 150) {
        return {
            isValid: false,
            message:
                "No puedes ingresar mas de 150 caracteres para el nombre de la Empresa",
        };
    } else if (name !== enterpriseName) {
        return {
            isValid: false,
            message: "El nombre ingresado no es el mismo que la empresa",
        };
    } else {
        return {
            isValid: true,
            message: "Nombre valido",
        };
    }
};

export function userBelongsToEnterprise(
    user: UserInterface,
    enterprise: Enterprise,
): boolean {
    return (
        user.id !== undefined &&
        enterprise.addedUsersId !== undefined &&
        enterprise.addedUsersId.includes(user.id)
    );
}
