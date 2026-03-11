import { UserRole } from "@/interfaces/UserInterface";

export const ROLES_TO_REVIEW_REQUESTS: UserRole[] = [
  UserRole.Admin,
  UserRole.SupportTwo,
];

export const ROLES_TO_VIEW_USERS: UserRole[] = [
  UserRole.Admin,
  UserRole.Support,
  UserRole.SupportTwo,
  UserRole.BalanceRecharge,
];

export const ROLES_TO_VIEW_USERS_INFO: UserRole[] = [
  UserRole.Admin,
  UserRole.Support,
  UserRole.SupportTwo,
  UserRole.BalanceRecharge,
];

export const ROLES_TO_VIEW_USER_SERVICES: UserRole[] = [
  UserRole.Admin,
  UserRole.Support,
  UserRole.SupportTwo,
];

export const ROLES_TO_VIEW_USER_STATE: UserRole[] = [
  UserRole.Admin,
  UserRole.Support,
  UserRole.SupportTwo,
];

export const ROLES_TO_ADD_USERS: UserRole[] = [UserRole.Admin];

export const ROLES_TO_MANAGEMENT_BALANCE: UserRole[] = [
  UserRole.Admin,
  UserRole.Support,
  UserRole.SupportTwo,
  UserRole.BalanceRecharge,
];

export const ROLES_TO_MANAGEMENT_ENTERPRISES: UserRole[] = [UserRole.Admin];

export const ROLES_TO_SEE_NO_USER_PROFILE: UserRole[] = [
  UserRole.Admin,
  UserRole.Support,
  UserRole.SupportTwo,
  UserRole.BalanceRecharge,
];

export const ROLES_TO_EDIT_USER_PROFILE: UserRole[] = [
  UserRole.Admin,
  UserRole.Support,
  UserRole.SupportTwo,
];

export const ROLES_FOR_SERVER_USER_ACTIONS: UserRole[] = [
  UserRole.User,
  UserRole.Admin,
  UserRole.Support,
  UserRole.SupportTwo,
];

export const ROLES_TO_SET_USER_ROLE: UserRole[] = [UserRole.Admin];

export const ROLES_FOR_DISABLE_USERS: UserRole[] = [
  UserRole.Admin,
  UserRole.SupportTwo,
];
export const ROLES_FOR_DELETE_USERS: UserRole[] = [UserRole.Admin];

export const ROLES_TO_SET_USER_BALANCE: UserRole[] = [
  UserRole.Admin,
  UserRole.Support,
  UserRole.SupportTwo,
  UserRole.BalanceRecharge,
];

export const ROLES_TO_SET_MIN_USER_BALANCE: UserRole[] = [
  UserRole.Admin,
  UserRole.Support,
  UserRole.SupportTwo,
];

export const ROLES_TO_VIEW_USERS_HISTORY: UserRole[] = [
  UserRole.Admin,
  UserRole.Support,
  UserRole.SupportTwo,
];

export const ROLES_TO_VIEW_CONTACT_USERS: UserRole[] = [
  UserRole.Admin,
  UserRole.Support,
  UserRole.SupportTwo,
];

export const ROLES_TO_VIEW_USER_CREDENTIALS: UserRole[] = [
  UserRole.Admin,
  UserRole.Support,
  UserRole.SupportTwo,
];

export const ROLES_TO_ADD_AGREEMENT_TO_ENTERPRISES: UserRole[] = [
  UserRole.Admin,
];
