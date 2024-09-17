import { ServiceReqState } from "@/interfaces/Services";
import { UserInterface } from "@/interfaces/UserInterface";
import { toast } from "react-toastify";
import { Enterprise } from "@/interfaces/Enterprise";
import { IUserAggregatorValidatorToEnterpriseAsMember } from "../IUserAggregatorValidatorToEnterpriseAsMember";
import {
    isAbleToBeSupportIntoEnterprise,
    userBelongsToEnterprise,
} from "@/components/app_modules/enterprises/validators/validators_of_user_aggregators_to_enterprise/as_members/UserAggregatorValidatorToEnterpriseHelper";
import { InputState } from "@/validators/InputValidatorSignature";

export class ValidatorToAddUserToLaundryEnterpriseAsMember
    implements IUserAggregatorValidatorToEnterpriseAsMember
{
    enterprise: Enterprise;

    constructor(enterprise: Enterprise) {
        this.enterprise = enterprise;
    }

    hasActiveRequests = (user: UserInterface): boolean => {
        return (
            user.serviceRequests?.laundry?.state === ServiceReqState.Reviewing
        );
    };

    isAbleToBeUserServer = (user: UserInterface): InputState => {
        let isWasher: boolean =
            user.serviceRequests?.laundry?.state === ServiceReqState.Approved;

        let hasRequestsReviwing: boolean = this.hasActiveRequests(user);

        let belongsToLaundryService: boolean = userBelongsToEnterprise(
            user,
            this.enterprise,
        );

        if (hasRequestsReviwing) {
            return {
                isValid: false,
                message:
                    "El usuario ya tiene una petición en progreso, espera a que sea revisada",
            };
        }

        if (isWasher && !belongsToLaundryService) {
            return {
                isValid: false,
                message:
                    "El usuario ya fue agregado a otro servicio como lavadero",
            };
        }

        if (belongsToLaundryService) {
            return {
                isValid: false,
                message: "El usuario ya fue agregado al servicio",
            };
        }
        return {
            isValid: true,
            message: "El usuario es valido para ser lavadero",
        };
    };

    isAbleToBeSupportUser = (user: UserInterface): InputState => {
        return isAbleToBeSupportIntoEnterprise(
            user,
            this.enterprise,
            "laundry",
        );
    };
}
