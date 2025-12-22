"use client";

import { getUserEnterprises } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { findServicePerfByFakeId } from "@/components/app_modules/services_performed/model/fetchers/ServicePerfFetcher";
import { ROLES_TO_VIEW_USER_SERVICES } from "@/components/guards/models/PermissionsByUserRole";
import { checkPermission } from "@/components/guards/validators/RoleValidator";
import PageLoading from "@/components/loaders/PageLoading";
import { AuthContext } from "@/context/AuthContext";
import { EnterpriseUser } from "@/interfaces/Enterprise";
import { ServiceType } from "@/interfaces/Services";
import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import {
  setVisitedToday,
  wasAlreadyVisited,
} from "@/utils/encryptors/EncryptionGeneratorByDate";
import { isLessTime } from "@/utils/helpers/DateHelper";
import { routeToNoFound } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";
import {
  SERVER_USER_QUERY_PARAM,
  SERVICES_REQUESTED_BASE_PATH,
} from "@/utils/route_builders/for_services/RouteBuilderForServices";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  serviceType: ServiceType;
  fakeServerUserId?: string;
  serviceFakeId?: string;
  children: React.ReactNode;
}

const GuardForServices: React.FC<Props> = ({
  serviceType,
  fakeServerUserId,
  serviceFakeId,
  children,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { checkingUserAuth, user } = useContext(AuthContext);
  const [hasPermission, setPermission] = useState<boolean>(false);
  const MODULE_TARGET = "userownerservice".concat(serviceType);

  const redirectToHome = () => {
    window.location.replace(routeToNoFound());
    toast.warning("Permiso denegado", {
      toastId: "check-permition-validator-page",
    });
  };

  const verifyPermissionForNormalUser = useCallback(
    async (user: UserInterface, fakeServerUserId: string) => {
      if (!user.id || !fakeServerUserId) {
        redirectToHome();
        return;
      }
      if (wasAlreadyVisited(MODULE_TARGET, fakeServerUserId)) {
        setPermission(true);
        return;
      }
      try {
        let userEnterprises = await getUserEnterprises(serviceType, user.id);

        let containUser: boolean = userEnterprises.reduce(
          (acc, e) =>
            acc || userWasAddedToEnterprise(e.addedUsers, fakeServerUserId),
          false,
        );
        if (containUser) {
          setVisitedToday(MODULE_TARGET, fakeServerUserId);
          setPermission(true);
        } else {
          redirectToHome();
        }
      } catch (e) {
        redirectToHome();
      }
    },
    [MODULE_TARGET, serviceType],
  );

  const userWasAddedToEnterprise = (
    usersAdded: EnterpriseUser[] | undefined,
    fakeUserId: string,
  ): boolean => {
    if (!usersAdded || usersAdded.length === 0) {
      return false;
    }

    return usersAdded.reduce(
      (acc, u) => acc || (u.fakeUserId === fakeUserId && u.role === "user"),
      false,
    );
  };

  const checkPermissionByUserRole = useCallback(() => {
    if (!user) {
      redirectToHome();
    } else if (checkPermission(user.role, ROLES_TO_VIEW_USER_SERVICES)) {
      setPermission(true);
    } else if (pathname.includes(SERVICES_REQUESTED_BASE_PATH)) {
      redirectToHome();
    } else if (user?.role === UserRole.User) {
      let fakeUserId = fakeServerUserId
        ? fakeServerUserId
        : searchParams.get(SERVER_USER_QUERY_PARAM);
      if (fakeUserId) {
        verifyPermissionForNormalUser(user, fakeUserId);
      } else {
        redirectToHome();
      }
    } else {
      redirectToHome();
    }
  }, [
    user,
    searchParams,
    fakeServerUserId,
    pathname,
    verifyPermissionForNormalUser,
  ]);

  const checkPermissionByServiceSharing = useCallback(
    async (serviceFakeId: string) => {
      try {
        let serviceFound = await findServicePerfByFakeId(
          serviceFakeId,
          serviceType,
        );
        if (!serviceFound) {
          checkPermissionByUserRole();
        } else if (isLessTime(serviceFound.sharing)) {
          setPermission(true);
        } else {
          checkPermissionByUserRole();
        }
      } catch {
        redirectToHome();
      }
    },
    [serviceType, checkPermissionByUserRole],
  );

  const startCheckPermission = useCallback(() => {
    if (!serviceFakeId) {
      checkPermissionByUserRole();
    } else {
      checkPermissionByServiceSharing(serviceFakeId);
    }
  }, [
    serviceFakeId,
    checkPermissionByUserRole,
    checkPermissionByServiceSharing,
  ]);

  useEffect(() => {
    if (!checkingUserAuth) {
      startCheckPermission();
    }
  }, [checkingUserAuth, startCheckPermission]);

  if (checkingUserAuth || !hasPermission) {
    return <PageLoading />;
  }

  return <WrapperWithSideBar>{children}</WrapperWithSideBar>;
};

export default GuardForServices;
