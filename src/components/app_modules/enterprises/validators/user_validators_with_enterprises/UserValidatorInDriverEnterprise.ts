import { ServiceReqState } from "@/interfaces/Services";
import { UserInterface } from "@/interfaces/UserInterface";
import { userBelongsToEnterprise } from "../EnterpriseValidator";
import { toast } from "react-toastify";
import { Enterprise } from "@/interfaces/Enterprise";
import { IUserValidatableInEnterprise } from "./IUserValidatableInEnterprise";
import { checkRegistrationForSingleVehicule } from "../../utils/UserValidatorInEnterpriseHelper";

export class UserValidatorInDriverEnterprise
    implements IUserValidatableInEnterprise
{
    enterprise: Enterprise;

    constructor(enterprise: Enterprise) {
        this.enterprise = enterprise;
    }

    hasCarActiveRevition = (user: UserInterface): boolean => {
        return (
            user.serviceRequests?.driveCar?.state === ServiceReqState.Reviewing
        );
    };

    hasMotorcycleActiveRevition = (user: UserInterface): boolean => {
        return (
            user.serviceRequests?.driveMotorcycle?.state ===
            ServiceReqState.Reviewing
        );
    };

    hasActiveRequests = (user: UserInterface): boolean => {
        return (
            this.hasCarActiveRevition(user) ||
            this.hasMotorcycleActiveRevition(user)
        );
    };

    isAbleToBeUserServer = (user: UserInterface): boolean => {
        let isAble = true;

        let isDriver: boolean =
            user.serviceRequests?.driveCar?.state ===
                ServiceReqState.Approved ||
            user.serviceRequests?.driveMotorcycle?.state ===
                ServiceReqState.Approved;

        let hasRequestsReviwing: boolean = this.hasActiveRequests(user);

        let belongsToDriverService: boolean = userBelongsToEnterprise(
            user,
            this.enterprise,
        );
        let { isAbleToRegisterASingleVehicule } =
            checkRegistrationForSingleVehicule(user);

        if (isAble && hasRequestsReviwing) {
            isAble = false;
            toast.error(
                "El usuario ya tiene una peticion en progreso, espera a que sea revisada",
            );
        }

        if (isAble && isDriver && !belongsToDriverService) {
            isAble = false;
            toast.error(
                "El usuario ya fue agregado a otro servicio como chofer",
            );
        }

        if (
            isAble &&
            belongsToDriverService &&
            !isAbleToRegisterASingleVehicule
        ) {
            isAble = false;
            toast.error("El usuario ya fue agregado al servicio");
        }

        if (
            isAble &&
            belongsToDriverService &&
            isAbleToRegisterASingleVehicule
        ) {
            toast.info("El usuario solo puede registrar el vehiculo faltante");
        }

        return isAble;
    };

    isAbleToBeSupportUser = (user: UserInterface): boolean => {
        let isAble = true;
        let hasActiveRequests: boolean =
            user.serviceRequests !== undefined &&
            (user.serviceRequests.driveCar?.state ===
                ServiceReqState.Reviewing ||
                user.serviceRequests.driveMotorcycle?.state ===
                    ServiceReqState.Reviewing);

        let isAlreadyUserServer: boolean = userBelongsToEnterprise(
            user,
            this.enterprise,
        );

        if (isAble && hasActiveRequests) {
            isAble = false;
            toast.error(
                "El usuario tiene peticiones activas para ser usuario servidor para este tipo de servicio",
            );
        }

        if (isAble && isAlreadyUserServer) {
            isAble = false;
            toast.error("El usuario ya pertenece al servicio");
        }

        return isAble;
    };
}
