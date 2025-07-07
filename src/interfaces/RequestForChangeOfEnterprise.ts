import { ServiceType } from "./Services";

export interface BaseSimpleEnterprise {
  name: string;
  logoUrl?: string;
}

export interface RequestForChangeOfEnterprise {
  id: string;
  active: boolean;
  serviceType: ServiceType;
  oldEnterpriseId?: string;
  newEnterpriseId: string;
  reason: string;
  userName: string;
  userId: string;
  newEnterpriseBaseData: BaseSimpleEnterprise;
}
