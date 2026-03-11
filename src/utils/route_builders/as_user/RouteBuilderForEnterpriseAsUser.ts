import { ServiceType } from "@/interfaces/Services";

const BASE_ROUTE = "/user/enterprise";

function enterpriseRoute(type: ServiceType): string {
  switch (type) {
    case "driver":
      return "driverenterprise";
    case "mechanical":
      return "mechanicalworkshop";
    case "laundry":
      return "laundry";
    default:
      return "crane";
  }
}

export function routeToAllEnterprisesAsUser(type: ServiceType): string {
  return BASE_ROUTE.concat("/").concat(enterpriseRoute(type));
}

export function routeToManageEnterpriseAsUser(
  type: ServiceType,
  enterpriseId: string,
): string {
  return routeToAllEnterprisesAsUser(type)
    .concat("/manage/")
    .concat(enterpriseId);
}
