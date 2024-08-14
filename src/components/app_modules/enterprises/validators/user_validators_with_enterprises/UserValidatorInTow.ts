import { ServiceReqState } from "@/interfaces/Services";
import { UserInterface } from "@/interfaces/UserInterface";
import { userBelongsToEnterprise } from "../EnterpriseValidator";
import { toast } from "react-toastify";
import { Enterprise } from "@/interfaces/Enterprise";
import { IUserValidatableInEnterprise } from "./IUserValidatableInEnterprise";
import { isAbleToBeSupportIntoEnterprise } from "../../utils/UserValidatorInEnterpriseHelper";

export class UserValidatorInTow implements IUserValidatableInEnterprise {
    enterprise: Enterprise;

    constructor(enterprise: Enterprise) {
        this.enterprise = enterprise;
    }

    hasActiveRequests = (user: UserInterface): boolean => {
        return user.serviceRequests?.tow?.state === ServiceReqState.Reviewing;
    };

    isAbleToBeUserServer = (user: UserInterface): boolean => {
        let isAble = true;

        let isCraneOperator: boolean =
            user.serviceRequests?.tow?.state === ServiceReqState.Approved;

        let hasRequestsReviwing: boolean = this.hasActiveRequests(user);

        let belongsToCraneService: boolean = userBelongsToEnterprise(
            user,
            this.enterprise,
        );

        if (isAble && hasRequestsReviwing) {
            isAble = false;
            toast.error(
                "El usuario ya tiene una peticion en progreso, espera a que sea revisada",
            );
        }

        if (isAble && isCraneOperator && !belongsToCraneService) {
            isAble = false;
            toast.error(
                "El usuario ya fue agregado a otro servicio como operador de grua",
            );
        }

        if (isAble && belongsToCraneService) {
            isAble = false;
            toast.error("El usuario ya fue agregado al servicio");
        }

        return isAble;
    };

    isAbleToBeSupportUser = (user: UserInterface): boolean => {
        return isAbleToBeSupportIntoEnterprise(user, this.enterprise, "tow");
    };
}
