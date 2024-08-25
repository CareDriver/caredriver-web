import {
    UserInterface,
    UserRole,
    USER_ROLE_TO_SPANISH,
} from "@/interfaces/UserInterface";

export function getUserRoleDetails(user: UserInterface): {
    text: string;
    color: string;
} {
    let roleDetails = {
        text: "Normal",
        color: "black",
    };

    if (user.role !== undefined && user.role !== UserRole.User) {
        roleDetails = {
            text: USER_ROLE_TO_SPANISH[user.role],
            color: "green",
        };
    } else if (user.services.length > 1) {
        roleDetails = {
            text: "Normal | Servidor",
            color: "black",
        };
    }

    return roleDetails;
}
