import { Timestamp } from "firebase/firestore";

export interface ActionOnUserInterface {
    id?: string; // firestore id
    userId: string; // id of the user who received the action
    traceId: string; // fake id
    reason: string;
    performedById: string; // id of the user that performed the action
    datetime: Timestamp;
    action: ActionOnUserPerformed;
}

export enum ActionOnUserPerformed {
    Deleted = "deleted",
    Disabled = "disabled",
    User = "changeRolToUser",
    BalanceRecharge = "changeRolToBalanceRecharge",
    Support = "changeRolToSupport",
    SupportTwo = "changeRolToSupportTwo",
    Admin = "changeRolToAdmin",
}