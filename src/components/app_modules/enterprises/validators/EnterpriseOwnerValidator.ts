import { countEnterprisesActives } from "../api/EnterpriseRequester";
import { ServiceType } from "@/interfaces/Services";
import { InputState } from "@/validators/InputValidatorSignature";
import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { hasTheSameLocation } from "../utils/UserValidatorInEnterpriseHelper";
import { Locations } from "@/interfaces/Locations";

export const MAX_NUMBER_ENTERPRISES = 5;
export async function verifyNumberOfUserEnterprises(
    userId: string,
    enterpriseType: ServiceType,
): Promise<InputState> {
    return countEnterprisesActives(userId, enterpriseType)
        .then((r) => {
            if (r < MAX_NUMBER_ENTERPRISES) {
                return {
                    isValid: true,
                    message: "Usuario valido",
                };
            } else {
                return {
                    isValid: false,
                    message: "Limite alcanzado de servicios por usuario",
                };
            }
        })
        .catch((e) => {
            return {
                isValid: false,
                message:
                    "Error verificando servicios del usuario, intentalo de nuevo",
            };
        });
}

export const verifyUserAvailabilityToBeEnterpriseOwner = async (
    userFound: UserInterface | undefined,
    newEnterpriseType: ServiceType,
    newEnterpriseLocation: Locations,
): Promise<InputState> => {
    if (!userFound || !userFound.id) {
        return {
            message: "Usuario no encontrado",
            isValid: false,
        };
    }

    if (userFound.role !== UserRole.User) {
        return {
            isValid: false,
            message: "El usuario no puede ser dueño de la empresa",
        };
    }

    if (!hasTheSameLocation(userFound, newEnterpriseLocation)) {
        return {
            isValid: false,
            message:
                "El usuario no esta en la misma localizacion que la empresa",
        };
    }

    let validationResult = await verifyNumberOfUserEnterprises(
        userFound.id,
        newEnterpriseType,
    );

    if (!validationResult.isValid) {
        return validationResult;
    }

    return {
        isValid: true,
        message: "Usuario valido para ser dueño de la empresa",
    };
};
