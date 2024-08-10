"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { toast } from "react-toastify";
import { ServiceReqState } from "@/interfaces/Services";
import PageLoading from "../loaders/PageLoading";

const UserRedirect = () => {
    const { loadingUser, user } = useContext(AuthContext);
    const router = useRouter();

    const redirectServerUser = (userData: UserInterface) => {
        if (userData.serviceRequests) {
            var pageRedirection;
            if (
                userData.serviceRequests.mechanic &&
                userData.serviceRequests.mechanic.state ===
                    ServiceReqState.Approved
            ) {
                pageRedirection = "/services/mechanic";
            } else if (
                userData.serviceRequests.tow &&
                userData.serviceRequests.tow.state === ServiceReqState.Approved
            ) {
                pageRedirection = "/services/tow";
            } else {
                pageRedirection = "/services/drive";
            }
            router.push(pageRedirection);
        } else {
            router.push("/services/drive");
        }
    };

    const redirectToUsers = () => {
        router.push("/admin/users");
    };

    const redirectToRequests = () => {
        router.push("/admin/requests/services/driver");
    };

    useEffect(() => {
        if (!loadingUser && user.data) {
            toast.success("Inicio de sesión exitoso");
            switch (user.data.role) {
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
                    redirectServerUser(user.data);
                    break;
            }
        }
    }, [loadingUser]);

    return loadingUser && <PageLoading />;
};

export default UserRedirect;
