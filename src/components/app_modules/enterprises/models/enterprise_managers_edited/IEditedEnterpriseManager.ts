import { Enterprise } from "@/interfaces/Enterprise";
import { ServiceType } from "@/interfaces/Services";

export interface IEditedEnterpriseManager {
  validateData(
    userId: string,
    enterpriseId: string,
    enterpriseType: ServiceType,
  ): Promise<boolean>;

  handle(oldEnterprise: Enterprise, newEnterprise: Enterprise): Promise<void>;

  getRedirectionAfterHandling(enterpriseType: ServiceType): string | undefined;
}
