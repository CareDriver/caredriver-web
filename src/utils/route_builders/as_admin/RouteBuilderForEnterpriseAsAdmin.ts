import { ServiceType } from "@/interfaces/Services";

const BASE_ROUTE = "/admin/enterprise";

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

// enterprises that are already registered
export function routeToAllEnterprisesAsAdmin(type: ServiceType): string {
  return BASE_ROUTE.concat("/registered/").concat(enterpriseRoute(type));
}

export function routeToCreateNewEnterpriseForAdmin(type: ServiceType): string {
  return routeToAllEnterprisesAsAdmin(type).concat("/new");
}

export function routeToManageEnterpriseAsAdmin(
  type: ServiceType,
  id: string,
): string {
  return routeToAllEnterprisesAsAdmin(type).concat("/manage/").concat(id);
}

// requests to be registered as edit
export function routeToRequestsToEditEnterpriseAsAdmin(
  type: ServiceType,
): string {
  return BASE_ROUTE.concat("/request/edit/").concat(enterpriseRoute(type));
}

export function routeToReviewRequestToEditEnterpriseAsAdmin(
  type: ServiceType,
  id: string,
): string {
  return routeToRequestsToEditEnterpriseAsAdmin(type).concat("/").concat(id);
}

// requests to register a new enterprise
export function routeToEnterpriseRegistrationRequestsAsAdmin(
  type: ServiceType,
): string {
  return BASE_ROUTE.concat("/request/register/").concat(enterpriseRoute(type));
}

export function routeToReviewEnterpriseRegistrationRequestAsAdmin(
  type: ServiceType,
  id: string,
): string {
  return routeToEnterpriseRegistrationRequestsAsAdmin(type)
    .concat("/")
    .concat(id);
}
