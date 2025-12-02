import { ServiceReqState } from "@/interfaces/Services";
import { UserInterface } from "@/interfaces/UserInterface";
import { Enterprise } from "@/interfaces/Enterprise";
import { IUserAggregatorValidatorToEnterpriseAsMember } from "../IUserAggregatorValidatorToEnterpriseAsMember";
import {
  isAbleToBeSupportIntoEnterprise,
  userBelongsToEnterprise,
} from "../UserAggregatorValidatorToEnterpriseHelper";
import { InputState } from "@/validators/InputValidatorSignature";

export class ValidatorToAddUserToWorkshopEnterpriseAsMember
  implements IUserAggregatorValidatorToEnterpriseAsMember
{
  enterprise: Enterprise;

  constructor(enterprise: Enterprise) {
    this.enterprise = enterprise;
  }

  hasActiveRequests = (user: UserInterface): boolean => {
    return user.serviceRequests?.mechanic?.state === ServiceReqState.Reviewing;
  };

  isAbleToBeUserServer = (user: UserInterface): InputState => {
    let isMechanic: boolean =
      user.serviceRequests?.mechanic?.state === ServiceReqState.Approved;

    let hasRequestsReviwing: boolean = this.hasActiveRequests(user);

    let belongsToMechanicService: boolean = userBelongsToEnterprise(
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

    if (isMechanic && !belongsToMechanicService) {
      return {
        isValid: false,
        message: "El usuario ya fue agregado a otro servicio como mecánico",
      };
    }

    if (belongsToMechanicService) {
      return {
        isValid: false,
        message: "El usuario ya fue agregado al servicio",
      };
    }

    return {
      isValid: true,
      message: "El usuario es valido para ser mecánico",
    };
  };

  isAbleToBeSupportUser = (user: UserInterface): InputState => {
    return isAbleToBeSupportIntoEnterprise(user, this.enterprise, "mechanic");
  };
}
