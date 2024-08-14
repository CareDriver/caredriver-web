import { Enterprise } from "@/interfaces/Enterprise";
import { UserInterface } from "@/interfaces/UserInterface";

export interface IUserValidatableInEnterprise {
    enterprise: Enterprise;
    hasActiveRequests: (user: UserInterface) => boolean;
    isAbleToBeUserServer: (user: UserInterface) => boolean;
    isAbleToBeSupportUser: (user: UserInterface) => boolean;

    // TODO: check if has max of enterprises added
    // isAbleToBeOwner: (user: UserInterface) => boolean;
}
