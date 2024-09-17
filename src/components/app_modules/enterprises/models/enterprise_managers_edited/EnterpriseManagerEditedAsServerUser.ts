import { Enterprise, ReqEditEnterprise } from "@/interfaces/Enterprise";
import { IEditedEnterpriseManager } from "./IEditedEnterpriseManager";
import { RequestLimitValidatorForEnterpriseEdit } from "../../validators/RequestLimitValidatorForEnterpriseEdit";
import { toast } from "react-toastify";
import { genDocId } from "@/utils/generators/IdGenerator";
import { sendEditEnterpriseReq } from "../../api/EditEnterpriseReq";
import { ServiceType } from "@/interfaces/Services";
import { routeToAllEnterprisesAsUser } from "@/utils/route_builders/as_user/RouteBuilderForEnterpriseAsUser";

export class EnterpriseManagerEditedAsServerUser
    implements IEditedEnterpriseManager
{
    requestLimitValidator: RequestLimitValidatorForEnterpriseEdit;

    constructor() {
        this.requestLimitValidator =
            new RequestLimitValidatorForEnterpriseEdit();
    }

    validateData = async (
        userId: string,
        enterpriseId: string,
        enterpriseType: ServiceType,
    ): Promise<boolean> => {
        let thereAreActiveReqs = await toast.promise(
            this.requestLimitValidator.validate(
                userId,
                enterpriseId,
                enterpriseType,
            ),
            {
                pending: "Buscando peticiones activas",
                error: "Error al buscar peticiones activas, inténtalo de nuevo por favor",
            },
        );

        if (thereAreActiveReqs) {
            toast.warning(
                "No puedes enviar una nueva petición para editar la empresa por ahora",
            );
        } else {
            toast.success("Valido para enviar una nueva petición de edición");
        }

        return !thereAreActiveReqs;
    };

    handle = async (enterprise: Enterprise): Promise<void> => {
        if (!enterprise.id) {
            return;
        }

        var reqId = genDocId();
        let enterpriseToEdit: ReqEditEnterprise = {
            ...enterprise,
            id: reqId,
            enterpriseId: enterprise.id,
            aproved: false,
            deleted: false,
            active: true,
        };

        await toast.promise(sendEditEnterpriseReq(reqId, enterpriseToEdit), {
            pending: "Enviando el formulario...",
            success: "Tu solicitud sera revisada, por favor se paciente",
            error: "Error al enviar el formulario, inténtalo de nuevo por favor",
        });
    };

    getRedirectionAfterHandling = (
        enterpriseType: ServiceType,
    ): string | undefined => {
        return routeToAllEnterprisesAsUser(enterpriseType);
    };
}
