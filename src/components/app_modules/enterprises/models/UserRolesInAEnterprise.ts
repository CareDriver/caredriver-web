import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import {
    isSupportInEnterprise,
    isTheEnterpriseOwner,
} from "../validators/validators_of_user_aggregators_to_enterprise/as_members/UserAggregatorValidatorToEnterpriseHelper";
import { Enterprise } from "@/interfaces/Enterprise";

export enum UserRoleForEnteprise {
    OWNER,
    SUPPORT,
    ADMIN,
    OTHER,
}

export function getUserRoleForEnterprise(
    user: UserInterface,
    enterprise: Enterprise,
): UserRoleForEnteprise {
    if (isTheEnterpriseOwner(user, enterprise)) {
        return UserRoleForEnteprise.OWNER;
    } else if (isSupportInEnterprise(user, enterprise)) {
        return UserRoleForEnteprise.SUPPORT;
    } else if (user.role === UserRole.Admin) {
        return UserRoleForEnteprise.ADMIN;
    } else {
        return UserRoleForEnteprise.OTHER;
    }
}
