import { countEnterprisesActives } from "../../../api/EnterpriseRequester";
import { ServiceType } from "@/interfaces/Services";
import { InputState } from "@/validators/InputValidatorSignature";
import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { hasTheSameLocation } from "../as_members/UserAggregatorValidatorToEnterpriseHelper";
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
                    "Error verificando servicios del usuario, inténtalo de nuevo",
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

    if (userFound.role === UserRole.BalanceRecharge) {
        return {
            isValid: false,
            message: "El usuario no puede ser dueño de la empresa porque es recargador de saldo",
        };
    }

    if (!hasTheSameLocation(userFound, newEnterpriseLocation)) {
        return {
            isValid: false,
            message:
                "El usuario no esta en la misma localización que la empresa",
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
