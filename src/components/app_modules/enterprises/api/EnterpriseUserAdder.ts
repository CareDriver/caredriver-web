import { Enterprise, EnterpriseUser } from "@/interfaces/Enterprise";
import { getEnterpriseById, updateEnterprise } from "./EnterpriseRequester";

export const addUserServerToEnterpriseById = async (
    enterpriseId: string,
    userId: string,
) => {
    let enterprise = await getEnterpriseById(enterpriseId);
    if (enterprise && enterprise.id) {
        let newUser: EnterpriseUser = {
            userId: userId,
            role: "user",
        };
        let enterpriseWithNewUser: Partial<Enterprise> = {
            addedUsersId: enterprise.addedUsersId
                ? [...enterprise.addedUsersId, userId]
                : [userId],
            addedUsers: enterprise.addedUsers
                ? [...enterprise.addedUsers, newUser]
                : [newUser],
        };
        await updateEnterprise(enterprise.id, enterpriseWithNewUser);
    }
};

export const addUserServerToEnterprise = async (
    enterprise: Enterprise,
    userId: string,
) => {
    if (enterprise.id) {
        let newUser: EnterpriseUser = {
            userId: userId,
            role: "user",
        };
        let enterpriseWithNewUser: Partial<Enterprise> = {
            addedUsersId: enterprise.addedUsersId
                ? [...enterprise.addedUsersId, userId]
                : [userId],
            addedUsers: enterprise.addedUsers
                ? [...enterprise.addedUsers, newUser]
                : [newUser],
        };
        await updateEnterprise(enterprise.id, enterpriseWithNewUser);
    }
};
