import { ServiceReqState } from "@/interfaces/Services";
import { UserInterface } from "@/interfaces/UserInterface";
import { toast } from "react-toastify";
import { Enterprise } from "@/interfaces/Enterprise";
import { IUserAggregatorValidatorToEnterpriseAsMember } from "../IUserAggregatorValidatorToEnterpriseAsMember";
import {
  checkRegistrationForSingleVehicule,
  userBelongsToEnterprise,
} from "@/components/app_modules/enterprises/validators/validators_of_user_aggregators_to_enterprise/as_members/UserAggregatorValidatorToEnterpriseHelper";
import { InputState } from "@/validators/InputValidatorSignature";
import { DRIVER } from "@/models/Business";

export class ValidatorToAddUserToDriverEnterpriseAsMember
  implements IUserAggregatorValidatorToEnterpriseAsMember
{
  enterprise: Enterprise;

  constructor(enterprise: Enterprise) {
    this.enterprise = enterprise;
  }

  hasCarActiveRevition = (user: UserInterface): boolean => {
    return user.serviceRequests?.driveCar?.state === ServiceReqState.Reviewing;
  };

  hasMotorcycleActiveRevition = (user: UserInterface): boolean => {
    return (
      user.serviceRequests?.driveMotorcycle?.state === ServiceReqState.Reviewing
    );
  };

  hasActiveRequests = (user: UserInterface): boolean => {
    return (
      this.hasCarActiveRevition(user) || this.hasMotorcycleActiveRevition(user)
    );
  };

  isAbleToBeUserServer = (user: UserInterface): InputState => {
    let isDriver: boolean =
      user.serviceRequests?.driveCar?.state === ServiceReqState.Approved ||
      user.serviceRequests?.driveMotorcycle?.state === ServiceReqState.Approved;

    let hasRequestsReviwing: boolean = this.hasActiveRequests(user);

    let belongsToDriverService: boolean = userBelongsToEnterprise(
      user,
      this.enterprise,
    );
    let { isAbleToRegisterASingleVehicule } =
      checkRegistrationForSingleVehicule(user);

    if (hasRequestsReviwing) {
      return {
        isValid: false,
        message:
          "El usuario ya tiene una petición en progreso, espera a que sea revisada",
      };
    }

    if (isDriver && !belongsToDriverService) {
      return {
        isValid: false,
        message: `El usuario ya fue agregado a otro servicio como ${DRIVER}`,
      };
    }

    if (belongsToDriverService && !isAbleToRegisterASingleVehicule) {
      return {
        isValid: false,
        message: "El usuario ya fue agregado al servicio",
      };
    }

    if (belongsToDriverService && isAbleToRegisterASingleVehicule) {
      toast.info("El usuario solo puede registrar el vehículo faltante");
    }

    return {
      isValid: true,
      message: "El usuario es valido para ser conductor",
    };
  };

  isAbleToBeSupportUser = (user: UserInterface): InputState => {
    let hasActiveRequests: boolean =
      user.serviceRequests !== undefined &&
      (user.serviceRequests.driveCar?.state === ServiceReqState.Reviewing ||
        user.serviceRequests.driveMotorcycle?.state ===
          ServiceReqState.Reviewing);

    let isAlreadyUserServer: boolean = userBelongsToEnterprise(
      user,
      this.enterprise,
    );

    if (hasActiveRequests) {
      return {
        isValid: false,
        message:
          "El usuario tiene peticiones activas para ser usuario servidor para este tipo de servicio",
      };
    }

    if (isAlreadyUserServer) {
      return {
        isValid: false,
        message: "El usuario ya pertenece al servicio",
      };
    }

    return {
      isValid: true,
      message: "El usuario es valido para usuario soporte",
    };
  };
}
