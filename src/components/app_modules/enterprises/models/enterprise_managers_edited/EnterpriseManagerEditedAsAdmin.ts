import { Enterprise } from "@/interfaces/Enterprise";
import { IEditedEnterpriseManager } from "./IEditedEnterpriseManager";
import { toast } from "react-toastify";
import { updateEnterprise } from "../../api/EnterpriseRequester";
import { ServiceType } from "@/interfaces/Services";
import { routeToAllEnterprisesAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";

export class EnterpriseManagerEditedAsAdmin
    implements IEditedEnterpriseManager
{
    validateData = async (
        userId: string,
        enterpriseId: string,
        enterpriseType: ServiceType,
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
        enterpriseType: ServiceType,
    ): string | undefined => {
        return routeToAllEnterprisesAsAdmin(enterpriseType);
    };
}
