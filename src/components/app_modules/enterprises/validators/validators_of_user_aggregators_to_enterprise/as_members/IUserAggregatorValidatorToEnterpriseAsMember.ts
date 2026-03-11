import { Enterprise } from "@/interfaces/Enterprise";
import { UserInterface } from "@/interfaces/UserInterface";
import { InputState } from "@/validators/InputValidatorSignature";

export interface IUserAggregatorValidatorToEnterpriseAsMember {
  enterprise: Enterprise;
  hasActiveRequests: (user: UserInterface) => boolean;
  isAbleToBeUserServer: (user: UserInterface) => InputState;
  isAbleToBeSupportUser: (user: UserInterface) => InputState;

  // TODO: check if has max of enterprises added
  // isAbleToBeOwner: (user: UserInterface) => boolean;
}
