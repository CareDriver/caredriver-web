import Cookies from "js-cookie";

export const setCookieToExpireAtEndOfDay = (
  name: string,
  value: string,
): void => {
  const now = new Date();
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  );

  const expiresInMilliseconds = endOfDay.getTime() - now.getTime();

  const expiresInDays = expiresInMilliseconds / (1000 * 60 * 60 * 24);

  Cookies.set(name, value, { expires: expiresInDays });
};

export const doesCookieExist = (name: string): boolean => {
  return Cookies.get(name) !== undefined;
};

export const doesCookieMatch = (name: string, expectValue: string): boolean => {
  const cookie = Cookies.get(name);
  if (cookie === undefined) {
    return false;
  }

  return cookie === expectValue;
};

export const deleteAllCookies = (): void => {
  const allCookies = Cookies.get();

  Object.keys(allCookies).forEach((cookieName) => {
    Cookies.remove(cookieName);
  });
};
