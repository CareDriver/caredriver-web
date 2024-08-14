import { UserInterface } from "@/interfaces/UserInterface";
import { userBelongsToEnterprise } from "../validators/EnterpriseValidator";
import { ServiceReqState } from "@/interfaces/Services";
import { Enterprise } from "@/interfaces/Enterprise";
import { toast } from "react-toastify";
import { Locations } from "@/interfaces/Locations";

export function hasTheSameLocation(
    userFound: UserInterface,
    location: Locations,
): boolean {
    return userFound.location !== undefined && userFound.location === location;
}

export function hasTheSameLocationOfEnterprise(
    userFound: UserInterface,
    enterprise: Enterprise,
): boolean {
    return (
        userFound.location !== undefined &&
        enterprise.location !== undefined &&
        userFound.location === enterprise.location
    );
}

export function isAbleToBeSupportIntoEnterprise(
    user: UserInterface,
    enterprise: Enterprise,
    type: "mechanic" | "tow" | "laundry",
): boolean {
    let isAble = true;

    let hasActiveRequests: boolean =
        user.serviceRequests !== undefined &&
        user.serviceRequests[type]?.state === ServiceReqState.Reviewing;

    let isAlreadyUserServer: boolean = userBelongsToEnterprise(
        user,
        enterprise,
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
}

export function checkRegistrationForSingleVehicule(user: UserInterface): {
    isAbleToRegisterASingleVehicule: boolean;
    type: "car" | "motorcycle" | undefined;
} {
    let type: "car" | "motorcycle" | undefined = undefined;
    let isCarNotRegistered: boolean =
        user.serviceRequests !== undefined &&
        user.serviceRequests.driveMotorcycle !== undefined &&
        user.serviceRequests.driveMotorcycle.state ===
            ServiceReqState.Approved &&
        (user.serviceRequests.driveCar === undefined ||
            user.serviceRequests.driveCar.state === ServiceReqState.NotSent ||
            user.serviceRequests.driveCar.state === ServiceReqState.Refused);

    let isMotorcycleNotRegistered: boolean =
        user.serviceRequests !== undefined &&
        user.serviceRequests.driveCar !== undefined &&
        user.serviceRequests.driveCar.state === ServiceReqState.Approved &&
        (user.serviceRequests.driveMotorcycle === undefined ||
            user.serviceRequests.driveMotorcycle.state ===
                ServiceReqState.NotSent ||
            user.serviceRequests.driveMotorcycle.state ===
                ServiceReqState.Refused);

    if (isCarNotRegistered) {
        type = "car";
    } else if (isMotorcycleNotRegistered) {
        type = "motorcycle";
    }

    return {
        isAbleToRegisterASingleVehicule:
            isCarNotRegistered || isMotorcycleNotRegistered,
        type,
    };
}

export function isTheEnterpriseOwner(
    user: UserInterface,
    enterprise: Enterprise,
): boolean {
    return user.id !== undefined && enterprise.userId === user.id;
}
