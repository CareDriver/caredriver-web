import { ServiceType } from "@/interfaces/Services";

export const SERVICE_BASE_PATH = "/service";
export const SERVICES_REQUESTED_BASE_PATH =
  SERVICE_BASE_PATH.concat("/many/requested/");
export const SHARED_SERVICE_BASE_PATH = SERVICE_BASE_PATH.concat("/share/");
export const SERVER_USER_QUERY_PARAM = "serveruser";

function serviceRoute(type: ServiceType): string {
  switch (type) {
    case "driver":
      return "driver";
    case "mechanical":
      return "mechanic";
    case "laundry":
      return "laundry";
    default:
      return "craneoperator";
  }
}

export function routeToServicesRequestedByUser(
  type: ServiceType,
  userId: string,
): string {
  return SERVICES_REQUESTED_BASE_PATH.concat(serviceRoute(type))
    .concat("/")
    .concat(userId);
}

export function routeToServicesServedByUser(
  type: ServiceType,
  userId: string,
): string {
  return SERVICE_BASE_PATH.concat("/many/served/")
    .concat(serviceRoute(type))
    .concat("/")
    .concat(userId);
}

export function routeToServicePerformed(
  type: ServiceType,
  serviceId: string,
  fakeServerUserId?: string,
): string {
  let path = SERVICE_BASE_PATH.concat("/only/performed/")
    .concat(serviceRoute(type))
    .concat("/")
    .concat(serviceId);

  if (!fakeServerUserId) {
    return path;
  } else {
    return path.concat(`?${SERVER_USER_QUERY_PARAM}=`).concat(fakeServerUserId);
  }
}

export function routeToSharedService(
  type: ServiceType,
  serviceId: string,
): string {
  return SHARED_SERVICE_BASE_PATH.concat(serviceRoute(type))
    .concat("/")
    .concat(serviceId);
}
