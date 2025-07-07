const BASE_ROUTE = "/admin/users";

// registers
export function routeToAllUsersAsAdmin(): string {
  return BASE_ROUTE;
}

export function routeToCreateNewUserAsAdmin(): string {
  return BASE_ROUTE.concat("/new");
}

export function routeToManageUserAsAdmin(userId: string): string {
  return BASE_ROUTE.concat("/manage/").concat(userId);
}

// requests
export function routeToUserRequestsToRenewPhotoAsAdmin(): string {
  return BASE_ROUTE.concat("/request/renew/profilepicture");
}

export function routeToReviewUserRequestToRenewPhotoAsAdmin(
  reqId: string,
): string {
  return routeToUserRequestsToRenewPhotoAsAdmin().concat("/").concat(reqId);
}
