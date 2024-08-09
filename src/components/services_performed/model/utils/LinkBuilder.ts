import { ServiceType } from "@/interfaces/Services";
import { TypeOfServicePerformed } from "../models/TypeOfServicePerformed";
import { isNullOrEmptyText } from "@/utils/validator/text/TextValidator";

export function buildLinkForServicePerformed(
    userId: string | undefined | null,
    serviceFakedId: string | undefined,
    typeOfService: ServiceType,
    typeOfPerf: TypeOfServicePerformed,
): string | undefined {
    if (isNullOrEmptyText(userId) || isNullOrEmptyText(serviceFakedId)) {
        return undefined;
    }

    if (userId && serviceFakedId) {
        let linkForPerf =
            typeOfPerf === TypeOfServicePerformed.Requested
                ? "servicerequests"
                : "services";

        let link = "/admin/users/"
            .concat(userId)
            .concat("/")
            .concat(linkForPerf)
            .concat("/")
            .concat(typeOfService)
            .concat("/")
            .concat(serviceFakedId);

        return link;
    }
}
