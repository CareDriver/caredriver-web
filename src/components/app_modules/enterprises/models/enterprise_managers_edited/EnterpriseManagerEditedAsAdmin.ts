import { Enterprise } from "@/interfaces/Enterprise";
import { IEditedEnterpriseManager } from "./IEditedEnterpriseManager";
import { toast } from "react-toastify";
import { updateEnterprise } from "../../api/EnterpriseRequester";
import { ServiceType } from "@/interfaces/Services";
import { routeToAllEnterprisesAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import { deleteFile } from "@/utils/requesters/FileUploader";

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

  handle = async (
    oldEnterprise: Enterprise,
    newEnterprise: Enterprise,
  ): Promise<void> => {
    if (!newEnterprise.id) {
      return;
    }

    try {
      if (oldEnterprise.logoImgUrl.ref !== newEnterprise.logoImgUrl.ref) {
        /* await toast.promise(deleteFile(oldEnterprise.logoImgUrl.ref), {
                    pending: "Eliminando logo anterior",
                    success: "Logo anterior eliminado",
                    error: "Error al eliminar el logo anterior, intentalo de nuevo por favor",
                }); */
      }

      await toast.promise(updateEnterprise(newEnterprise.id, newEnterprise), {
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
