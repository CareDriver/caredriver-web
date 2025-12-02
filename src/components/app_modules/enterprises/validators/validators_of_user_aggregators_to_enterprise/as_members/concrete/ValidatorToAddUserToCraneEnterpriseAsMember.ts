import { ServiceReqState } from "@/interfaces/Services";
import { UserInterface } from "@/interfaces/UserInterface";
import { Enterprise } from "@/interfaces/Enterprise";
import { IUserAggregatorValidatorToEnterpriseAsMember } from "../IUserAggregatorValidatorToEnterpriseAsMember";
import {
  isAbleToBeSupportIntoEnterprise,
  userBelongsToEnterprise,
} from "@/components/app_modules/enterprises/validators/validators_of_user_aggregators_to_enterprise/as_members/UserAggregatorValidatorToEnterpriseHelper";
import { InputState } from "@/validators/InputValidatorSignature";

export class ValidatorToAddUserToCraneEnterpriseAsMember
  implements IUserAggregatorValidatorToEnterpriseAsMember
{
  enterprise: Enterprise;

  constructor(enterprise: Enterprise) {
    this.enterprise = enterprise;
  }

  hasActiveRequests = (user: UserInterface): boolean => {
    return user.serviceRequests?.tow?.state === ServiceReqState.Reviewing;
  };

  isAbleToBeUserServer = (user: UserInterface): InputState => {
    let isCraneOperator: boolean =
      user.serviceRequests?.tow?.state === ServiceReqState.Approved;

    let hasRequestsReviwing: boolean = this.hasActiveRequests(user);

    let belongsToCraneService: boolean = userBelongsToEnterprise(
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

    if (isCraneOperator && !belongsToCraneService) {
      return {
        isValid: false,
        message:
          "El usuario ya fue agregado a otro servicio como operador de grúa",
      };
    }

    if (belongsToCraneService) {
      return {
        isValid: false,
        message: "El usuario ya fue agregado al servicio",
      };
    }

    return {
      isValid: true,
      message: "El usuario es valido para ser operador de grúa",
    };
  };

  isAbleToBeSupportUser = (user: UserInterface): InputState => {
    return isAbleToBeSupportIntoEnterprise(user, this.enterprise, "tow");
  };
}
