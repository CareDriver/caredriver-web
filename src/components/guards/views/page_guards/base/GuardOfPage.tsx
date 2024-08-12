"use client";
import { checkPermission } from "@/components/guards/utils/RoleValidator";
import PageLoading from "@/components/loaders/PageLoading";
import { AuthContext } from "@/context/AuthContext";
import { UserRole } from "@/interfaces/UserInterface";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const GuardOfPage = ({
    roles,
    children,
}: {
    roles: UserRole[];
    children: React.ReactNode;
}) => {
    const { checkingUserAuth, user } = useContext(AuthContext);
    const [hasPermition, setPermition] = useState<boolean>(false);

    const redirectToHome = () => {
        /* TODO: redirect to no found page like github
        https://europe1.discourse-cdn.com/business20/uploads/make/optimized/2X/1/13bde2c3bb2f6b4d6e52197d981011cb068f57f4_2_690x356.jpeg
        */
        window.location.replace("/redirector");
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
