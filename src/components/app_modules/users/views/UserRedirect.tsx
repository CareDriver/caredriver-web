"use client";

import { AuthContext } from "@/context/AuthContext";
import { useCallback, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { toast } from "react-toastify";
import PageLoading from "../../../loaders/PageLoading";
import { routeToAllUsersAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";
import { routeToRequestsToBeUserServerAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUserServerAsAdmin";
import { routeToServerServicesHubAsUser } from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";

const UserRedirect = () => {
  const { checkingUserAuth, user } = useContext(AuthContext);
  const router = useRouter();

  const redirectServerUser = useCallback(
    (userData: UserInterface) => {
      router.push(routeToServerServicesHubAsUser());
    },
    [router],
  );

  const redirectToUsers = useCallback(() => {
    router.push(routeToAllUsersAsAdmin());
  }, [router]);

  const redirectToRequests = useCallback(() => {
    // default request view is for driver
    router.push(routeToRequestsToBeUserServerAsAdmin("driver"));
  }, [router]);

  useEffect(() => {
    if (!checkingUserAuth && user) {
      toast.success("Inicio de sesión exitoso", {
        toastId: "login-init-toas",
      });
      switch (user.role) {
        case UserRole.Support:
        case UserRole.BalanceRecharge:
          redirectToUsers();
          break;
        case UserRole.SupportTwo:
        case UserRole.Admin:
          redirectToRequests();
          break;
        case UserRole.SupportTwo:
        default:
          redirectServerUser(user);
          break;
      }
    }
  }, [
    checkingUserAuth,
    redirectServerUser,
    redirectToRequests,
    redirectToUsers,
    user,
  ]);

  return checkingUserAuth && <PageLoading />;
};

export default UserRedirect;
