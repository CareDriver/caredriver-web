import { ServiceType } from "@/interfaces/Services";

const BASE_ROUTE = "/admin/userserver";

function serviceRoute(type: ServiceType): string {
  switch (type) {
    case "driver":
      return "driver";
    case "mechanical":
      return "mechanic";
    case "laundry":
      return "launderer";
    default:
      return "craneoperator";
  }
}

// requests
export function routeToRequestsToBeUserServerAsAdmin(
  type: ServiceType,
): string {
  return BASE_ROUTE.concat("/request/new/").concat(serviceRoute(type));
}

export function routeToReviewRequestToBeUserServerAsAdmin(
  type: ServiceType,
  reqId: string,
): string {
  return routeToRequestsToBeUserServerAsAdmin(type).concat("/").concat(reqId);
}

export function routeToRequestsToRenewLicenseAsAdmin(): string {
  return BASE_ROUTE.concat("/request/renew/license");
}

export function routeToReviewRequestToRenewLicenseAsAdmin(
  reqId: string,
): string {
  return routeToRequestsToRenewLicenseAsAdmin().concat("/").concat(reqId);
}

export function routeToUserRequestsToChangeEnterpriseAsAdmin(): string {
  return BASE_ROUTE.concat("/request/renew/enterprise");
}

export function routeToReviewRequestToChangeEnterpriseAsAdmin(
  reqId: string,
): string {
  return routeToUserRequestsToChangeEnterpriseAsAdmin()
    .concat("/")
    .concat(reqId);
}
