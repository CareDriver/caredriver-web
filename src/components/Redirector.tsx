"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import PageLoader from "./PageLoader";
import { useRouter } from "next/navigation";
import { UserRole } from "@/interfaces/UserInterface";
import { toast } from "react-toastify";
import { ServiceReqState } from "@/interfaces/Services";

const Redirector = () => {
    const { loadingUser, user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loadingUser && user.data) {
            toast.success("Inicio de sesion exitoso");
            if (user.data.role === UserRole.User) {
                if (user.data.serviceRequests) {
                    var pageRedirection;
                    if (
                        user.data.serviceRequests.mechanic &&
                        user.data.serviceRequests.mechanic.state ===
                        ServiceReqState.Approved
                    ) {
                        pageRedirection = "/services/mechanic";
                    } else if (
                        user.data.serviceRequests.tow &&
                        user.data.serviceRequests.tow.state === ServiceReqState.Approved
                    ) {
                        pageRedirection = "/services/tow";
                    } else {
                        pageRedirection = "/services/drive";
                    }
                    router.push(pageRedirection);
                } else {
                    router.push("/services/drive");
                }
            } else {
                router.push("/admin/requests/services/driver");
            }
        }
    }, [loadingUser]);

    return loadingUser && <PageLoader />;
};

export default Redirector;
