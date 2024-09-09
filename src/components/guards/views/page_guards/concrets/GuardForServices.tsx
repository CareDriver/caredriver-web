"use client";

import { getUserEnterprises } from "@/components/app_modules/enterprises/api/EnterpriseRequester";
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
import { routeToNoFound } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";
import {
    SERVER_USER_QUERY_PARAM,
    SERVICES_REQUESTED_BASE_PATH,
} from "@/utils/route_builders/for_services/RouteBuilderForServices";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
    serviceType: ServiceType;
    fakeServerUserId?: string;
    children: React.ReactNode;
}

const GuardForServices: React.FC<Props> = ({
    serviceType,
    fakeServerUserId,
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

    const verifyPermissionForNormalUser = async (
        user: UserInterface,
        fakeServerUserId: string,
    ) => {
        if (!user.id || !fakeServerUserId) {
            redirectToHome();
            return;
        }
        if (wasAlreadyVisited(MODULE_TARGET, fakeServerUserId)) {
            setPermission(true);
            return;
        }
        try {
            let userEnterprises = await getUserEnterprises(
                serviceType,
                user.id,
            );

            let containUser: boolean = userEnterprises.reduce(
                (acc, e) =>
                    acc ||
                    userWasAddedToEnterprise(e.addedUsers, fakeServerUserId),
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
    };

    const userWasAddedToEnterprise = (
        usersAdded: EnterpriseUser[] | undefined,
        fakeUserId: string,
    ): boolean => {
        if (!usersAdded || usersAdded.length === 0) {
            return false;
        }

        return usersAdded.reduce(
            (acc, u) =>
                acc || (u.fakeUserId === fakeUserId && u.role === "user"),
            false,
        );
    };

    useEffect(() => {
        if (!checkingUserAuth) {
            if (!user) {
                redirectToHome();
            } else if (
                checkPermission(user.role, ROLES_TO_VIEW_USER_SERVICES)
            ) {
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
        }
    }, [checkingUserAuth]);

    if (checkingUserAuth || !hasPermission) {
        return <PageLoading />;
    }

    return <WrapperWithSideBar>{children}</WrapperWithSideBar>;
};

export default GuardForServices;
