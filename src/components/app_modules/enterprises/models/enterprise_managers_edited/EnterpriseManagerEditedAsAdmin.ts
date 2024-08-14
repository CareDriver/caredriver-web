import { Enterprise } from "@/interfaces/Enterprise";
import { IEditedEnterpriseManager } from "./IEditedEnterpriseManager";
import { toast } from "react-toastify";
import { getRoute } from "@/utils/parser/ToSpanishEnterprise";
import { updateEnterprise } from "../../api/EnterpriseRequester";

export class EnterpriseManagerEditedAsAdmin
    implements IEditedEnterpriseManager
{
    validateData = async (
        userId: string,
        enterpriseId: string,
        enterpriseType: "mechanical" | "tow" | "laundry" | "driver",
    ): Promise<boolean> => {
        return true;
    };

    handle = async (enterprise: Enterprise): Promise<void> => {
        if (!enterprise.id) {
            return;
        }

        try {
            await toast.promise(updateEnterprise(enterprise.id, enterprise), {
                pending: `Editando empresa`,
                success: "Empresa editada",
                error: `Error al editar la empresa, inténtalo de nuevo por favor`,
            });
        } catch (e) {}
    };

    getRedirectionAfterHandling = (
        enterpriseType: "mechanical" | "tow" | "laundry" | "driver",
    ): string | undefined => {
        let route = `/admin/enterprises/${getRoute(enterpriseType)}`;
        return route;
    };
}
