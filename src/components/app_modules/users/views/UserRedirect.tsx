"use client";

import { AuthContext } from "@/context/AuthContext";
import { useCallback, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { toast } from "react-toastify";
import { ServiceReqState } from "@/interfaces/Services";
import PageLoading from "../../../loaders/PageLoading";
import { routeToAllUsersAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";
import { routeToRequestToBeServerUserAsUser } from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";
import { routeToRequestsToBeUserServerAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUserServerAsAdmin";

const UserRedirect = () => {
  const { checkingUserAuth, user } = useContext(AuthContext);
  const router = useRouter();

  const redirectServerUser = useCallback(
    (userData: UserInterface) => {
      if (userData.serviceRequests) {
        var pageRedirection;
        if (
          userData.serviceRequests.mechanic &&
          userData.serviceRequests.mechanic.state === ServiceReqState.Approved
        ) {
          pageRedirection = routeToRequestToBeServerUserAsUser("mechanical");
        } else if (
          userData.serviceRequests.tow &&
          userData.serviceRequests.tow.state === ServiceReqState.Approved
        ) {
          pageRedirection = routeToRequestToBeServerUserAsUser("tow");
        } else {
          pageRedirection = routeToRequestToBeServerUserAsUser("driver");
        }
        router.push(pageRedirection);
      } else {
        router.push(routeToRequestToBeServerUserAsUser("driver"));
      }
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
