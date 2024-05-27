"use client";
import { UserRole } from "@/interfaces/UserInterface";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { checkPermission } from "@/utils/validator/roles/RoleValidator";
import PageLoader from "@/components/PageLoader";

const PagePermissionValidator = ({
    roles,
    children,
}: {
    roles: UserRole[];
    children: React.ReactNode;
}) => {
    const { loadingUser, user } = useContext(AuthContext);
    const [hasPermition, setPermition] = useState<boolean>(false);
    const router = useRouter();

    const redirectToHome = () => {
        router.push("/redirector");
        toast.warning("Permiso denegado", {
            toastId: "check-permition-validator-page",
        });
    };

    useEffect(() => {
        if (!loadingUser) {
            if (!user.data) {
                redirectToHome();
            } else if (!checkPermission(user.data.role, roles)) {
                redirectToHome();
            } else {
                setPermition(true);
            }
        }
    }, [loadingUser]);

    return loadingUser || hasPermition === false ? <PageLoader /> : <>{children}</>;
};

export default PagePermissionValidator;
