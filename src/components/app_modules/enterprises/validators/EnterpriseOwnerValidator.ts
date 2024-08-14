import { toast } from "react-toastify";
import { countEnterprisesActives } from "../api/EnterpriseRequester";

export const MAX_NUMBER_ENTERPRISES = 5;

export async function isValidToBeTheEnterpriseOwner(
    userId: string,
    enterpriseType: "mechanical" | "tow" | "laundry" | "driver",
): Promise<boolean> {
    return countEnterprisesActives(userId, enterpriseType)
        .then((r) => {
            if (r < MAX_NUMBER_ENTERPRISES) {
                return true;
            } else {
                toast.info("Limite alcanzado de servicios por usuario");
                return false;
            }
        })
        .catch((e) => {
            toast.error(
                "Error verificando servicios del usuario, intentalo de nuevo",
            );
            return false;
        });
}
