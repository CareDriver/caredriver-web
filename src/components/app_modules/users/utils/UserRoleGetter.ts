import {
    UserInterface,
    UserRole,
    USER_ROLE_TO_SPANISH,
} from "@/interfaces/UserInterface";

export function isUserServer(user: UserInterface): boolean {
    return user.services.length > 1;
}

export function getUserRoleDetails(user: UserInterface): {
    text: string;
    color: string;
} {
    let roleDetails = {
        text: "Usuario normal",
        color: "black",
    };

    if (user.role !== undefined && user.role !== UserRole.User) {
        roleDetails = {
            text: "Usuario ".concat(
                USER_ROLE_TO_SPANISH[user.role].toLowerCase(),
            ),
            color: "green-light",
        };
    } else if (isUserServer(user)) {
        roleDetails = {
            text: "Usuario normal - servidor",
            color: "black",
        };
    }

    return roleDetails;
}
