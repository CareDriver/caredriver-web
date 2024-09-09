"use client";
import { checkPermission } from "@/components/guards/validators/RoleValidator";
import PageLoading from "@/components/loaders/PageLoading";
import { AuthContext } from "@/context/AuthContext";
import { UserRole } from "@/interfaces/UserInterface";
import { routeToNoFound } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
    roles: UserRole[];
    children: React.ReactNode;
}

const GuardOfPage: React.FC<Props> = ({ roles, children }) => {
    const { checkingUserAuth, user } = useContext(AuthContext);
    const [hasPermition, setPermition] = useState<boolean>(false);

    const redirectToHome = () => {
        window.location.replace(routeToNoFound());
        toast.warning("Permiso denegado", {
            toastId: "check-permition-validator-page",
        });
    };

    useEffect(() => {
        if (!checkingUserAuth) {
            if (!user) {
                redirectToHome();
            } else if (!checkPermission(user.role, roles)) {
                redirectToHome();
            } else {
                setPermition(true);
            }
        }
    }, [checkingUserAuth]);

    return checkingUserAuth || hasPermition === false ? (
        <PageLoading />
    ) : (
        <>{children}</>
    );
};

export default GuardOfPage;
