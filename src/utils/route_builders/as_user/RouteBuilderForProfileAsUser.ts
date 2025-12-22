const BASE_ROUTE = "/user/profile";

export function routeToProfileAsUser(): string {
  return BASE_ROUTE;
}

export function routeToRenewLocationAsUser(): string {
  return BASE_ROUTE.concat("/renew/location");
}

export function routeToRenewPhotoAsUser(): string {
  return BASE_ROUTE.concat("/renew/profilepicture");
}

export function routeToRenewPhoneAsUser(): string {
  return BASE_ROUTE.concat("/renew/phone");
}
