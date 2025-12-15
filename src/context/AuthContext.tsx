"use client";

import { auth } from "@/firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  DEFAULT_PHONE,
  defaultServiceReq,
  flatPhone,
  UserInterface,
  UserRole,
} from "@/interfaces/UserInterface";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useState, useEffect, useCallback } from "react";
import { getUserById } from "@/components/app_modules/users/api/UserRequester";
import { servicesData } from "@/interfaces/ServicesDataInterface";
import { toast } from "react-toastify";
import { EMPTY_REF_ATTACHMENT } from "@/components/form/models/RefAttachment";
import { defaultBalance, defaultMinBalance } from "@/interfaces/Payment";
import { deleteAllCookies } from "@/utils/storage_handlers/CookieStoragerer";
import { routeToHomePage } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";
import {
  differenceOnDays,
  timestampDateInSpanish,
} from "@/utils/helpers/DateHelper";
import { Locations } from "@/interfaces/Locations";
import { isNullOrEmptyText } from "@/validators/TextValidator";
import { Timestamp } from "firebase/firestore";

interface UserProps {
  hasPhoto: boolean;
  hasLocation: boolean;
  hasPhone: boolean;
}

const DEFAULT_USER_PROPS: UserProps = {
  hasPhoto: false,
  hasLocation: false,
  hasPhone: false,
};

type ContextType = {
  user: UserInterface | undefined;
  checkingUserAuth: boolean;
  userProps: UserProps;

  logout: () => void;
};

const DEFAULT_CONTEXT: ContextType = {
  user: undefined,
  checkingUserAuth: true,
  userProps: DEFAULT_USER_PROPS,

  logout: () => {},
};

const loadUserLoggedData = (
  id: string,
  userData: UserInterface | undefined,
): UserInterface | undefined => {
  if (userData) {
    return {
      id: id,
      fakeId: userData.fakeId ?? "",
      fullName: userData?.fullName ?? "",
      phoneNumber: userData?.phoneNumber ?? DEFAULT_PHONE,
      lastPhoneVerification: userData.lastPhoneVerification ?? Timestamp.now(),
      alternativePhoneNumberName: userData.alternativePhoneNumberName,
      alternativePhoneNumber: userData.alternativePhoneNumber,
      photoUrl: userData?.photoUrl ?? EMPTY_REF_ATTACHMENT,
      vehicles: userData?.vehicles ?? [],
      services: userData?.services ?? [],
      servicesData: userData?.servicesData ?? servicesData,
      pickUpLocationsHistory: userData?.pickUpLocationsHistory ?? [],
      deliveryLocationsHistory: userData?.deliveryLocationsHistory ?? [],
      email: userData?.email ?? "",
      serviceRequests: userData?.serviceRequests ?? defaultServiceReq,
      location: userData?.location ?? Locations.CochabambaBolivia,
      balance: userData?.balance ?? defaultBalance,
      balanceHistory: userData?.balanceHistory ?? [],
      disabledUntil: userData.disabledUntil,
      createdAt: userData.createdAt,
      serverUserAt: userData.serverUserAt,
      disable: userData?.disable,
      deleted: userData.deleted,
      serviceVehicles: userData?.serviceVehicles,
      role: userData?.role ?? UserRole.User,
      identityCard: userData.identityCard,
      minimumBalance: userData.minimumBalance ?? defaultMinBalance,
      branding: userData.branding,
      driverEnterpriseId: userData.driverEnterpriseId,
      laundryEnterpriseId: userData.laundryEnterpriseId,
      mechanicalWorkShopId: userData.mechanicalWorkShopId,
      towEnterpriseId: userData.towEnterpriseId,
      homeAddress: "",
      addressPhoto: userData.addressPhoto ?? EMPTY_REF_ATTACHMENT,
    };
  }

  return undefined;
};

export const AuthContext = createContext<ContextType>(DEFAULT_CONTEXT);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingUserAuth, setCheckUserAuth] = useState(true);
  const [user, setUser] = useState<UserInterface | undefined>(undefined);
  const [userProps, setUserProps] = useState<UserProps>(DEFAULT_USER_PROPS);

  const redirectToHome = useCallback(() => {
    if (!pathname.includes("auth")) {
      router.push(routeToHomePage());
    }
  }, [pathname, router]);

  const logoutWithReason = useCallback(
    (reason: string) => {
      auth
        .signOut()
        .then(() => {
          setUser(undefined);
          toast.warning(reason, {
            toastId: "toast-logout-with-reason",
          });
          router.push(routeToHomePage());
        })
        .catch((err) => {
          toast.error("Algo salió mal", {
            toastId: "logout-error",
          });
          if (typeof window !== "undefined") {
            window.location.replace(routeToHomePage());
          }
        });
    },
    [router, setUser],
  );

  useEffect(() => {
    onAuthStateChanged(auth, (res) => {
      if (res) {
        var userId = res.uid;
        try {
          (async () => {
            let userData = await getUserById(userId);

            // If user doc is not yet available, retry a few times (short polling)
            let attempts = 0;
            const maxAttempts = 4;
            const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
            while (!userData && attempts < maxAttempts) {
              attempts++;
              await delay(500);
              userData = await getUserById(userId);
            }

            if (userData) {
              if (userData.deleted) {
                logoutWithReason(
                  "Tu cuenta fue borrada, comunícate con uno de nuestro administradores",
                );
              } else if (userData.disable) {
                logoutWithReason(
                  "Fuiste desabilitado, comunícate con uno de nuestro administradores",
                );
              } else if (
                userData.disabledUntil &&
                differenceOnDays(userData.disabledUntil.toDate()) > 0
              ) {
                logoutWithReason(
                  `Fuiste desabilitado hasta el ${timestampDateInSpanish(
                    userData.disabledUntil,
                  )}, comunícate con uno de nuestro administradores`,
                );
              } else {
                let userLoaded: UserInterface | undefined = loadUserLoggedData(
                  userId,
                  userData,
                );
                setUserProps((prev) => ({
                  ...prev,
                  hasLocation: userData.location !== undefined,
                  hasPhone: !isNullOrEmptyText(flatPhone(userData.phoneNumber)),
                  hasPhoto:
                    userData.photoUrl.url.length > 0 &&
                    userData.photoUrl.url.trim().length > 0,
                }));
                setUser(userLoaded);
                setCheckUserAuth(false);
              }
            } else {
              // If after retries we still don't have user data, avoid immediate redirect
              // because it can race with user creation. Just mark checking finished
              // and let the page that initiated auth decide navigation.
              setUser(undefined);
              setCheckUserAuth(false);
            }
          })();
        } catch (e) {
          setUser(undefined);
          setCheckUserAuth(false);
          redirectToHome();
        }
      } else {
        setCheckUserAuth(false);
        redirectToHome();
      }
    });
  }, [logoutWithReason, redirectToHome]);

  const logout = () => {
    auth
      .signOut()
      .then(() => {
        deleteAllCookies();
        setUser(undefined);
        toast.success("Sesión cerrada existosamente", {
          toastId: "logout-toast",
        });
        router.push(routeToHomePage());
      })
      .catch(() => {
        toast.error("Algo salio mal", {
          toastId: "logout-error-2",
        });
        window.location.replace(routeToHomePage());
      });
  };

  return (
    <AuthContext.Provider value={{ checkingUserAuth, user, logout, userProps }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProviderContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthProvider;
