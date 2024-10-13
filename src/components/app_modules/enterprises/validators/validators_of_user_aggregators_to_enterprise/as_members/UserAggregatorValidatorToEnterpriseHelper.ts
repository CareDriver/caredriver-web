import { UserInterface } from "@/interfaces/UserInterface";
import { ServiceReqState } from "@/interfaces/Services";
import { Enterprise, UserRoleInEnterprise } from "@/interfaces/Enterprise";
import { Locations } from "@/interfaces/Locations";
import { InputState } from "@/validators/InputValidatorSignature";

export function userBelongsToEnterprise(
    user: UserInterface,
    enterprise: Enterprise,
): boolean {
    return (
        user.id !== undefined &&
        enterprise.addedUsersId !== undefined &&
        enterprise.addedUsersId.includes(user.id)
    );
}

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
): InputState {
    let isAble = true;

    let hasActiveRequests: boolean =
        user.serviceRequests !== undefined &&
        user.serviceRequests[type]?.state === ServiceReqState.Reviewing;

    let isAlreadyUserServer: boolean = userBelongsToEnterprise(
        user,
        enterprise,
    );

    if (isAble && hasActiveRequests) {
        return {
            isValid: false,
            message:
                "El usuario tiene peticiones activas para ser usuario servidor para este tipo de servicio",
        };
    }

    if (isAble && isAlreadyUserServer) {
        return {
            isValid: false,
            message: "El usuario ya pertenece al servicio",
        };
    }

    return {
        isValid: true,
        message: "El usuario es valido para usuario soporte",
    };
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

export function isSupportInEnterprise(
    user: UserInterface,
    enterprise: Enterprise,
): boolean {
    if (!enterprise.addedUsers || !user.id) {
        return false;
    }

    return enterprise.addedUsers.reduce(
        (acc, u) => acc || (u.userId === user.id && u.role === "support"),
        false,
    );
}

export function countUsersByRoleInEnterprise(
    enterprise: Enterprise,
    role: UserRoleInEnterprise,
): number {
    if (!enterprise.addedUsers) {
        return 0;
    }

    return enterprise.addedUsers?.filter((u) => u.role === role).length;
}

export function anySupportUsersInEnterprise(enterprise: Enterprise): boolean {
    return countUsersByRoleInEnterprise(enterprise, "support") > 0;
}

export function anyServerUsersInEnterprise(enterprise: Enterprise): boolean {
    return countUsersByRoleInEnterprise(enterprise, "user") > 0;
}
