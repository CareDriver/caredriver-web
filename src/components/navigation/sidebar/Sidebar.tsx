"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";
import "@/styles/components/sidebar.css";
import "@/styles/base/reset.css";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { UserRole } from "@/interfaces/UserInterface";
import AdminSideBar from "./concrets/AdminSideBar";
import ServerUserSideBar from "./concrets/ServerUserSideBar";
import SupportSideBar from "./concrets/SupportSideBar";
import SupportTwoSideBar from "./concrets/SupportTwoSideBar";
import BalanceChargeSideBar from "./concrets/BalanceChargeSideBar";
import {
    checkPermission,
    ROLES_FOR_SERVER_USER_ACTIONS,
} from "@/utils/validator/roles/RoleValidator";

const SideBar = () => {
    const { loadingUser, user } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const pathname = usePathname();

    const getSideBar = () => {
        if (user.data) {
            if (
                !pathname.includes("admin") &&
                checkPermission(user.data.role, ROLES_FOR_SERVER_USER_ACTIONS)
            ) {
                return <ServerUserSideBar logout={logout} pathname={pathname} />;
            } else {
                switch (user.data.role) {
                    case UserRole.Admin:
                        return <AdminSideBar logout={logout} pathname={pathname} />;
                    case UserRole.Support:
                        return <SupportSideBar logout={logout} pathname={pathname} />;
                    case UserRole.SupportTwo:
                        return <SupportTwoSideBar logout={logout} pathname={pathname} />;
                    case UserRole.BalanceRecharge:
                        return (
                            <BalanceChargeSideBar logout={logout} pathname={pathname} />
                        );
                    default:
                        return <ServerUserSideBar logout={logout} pathname={pathname} />;
                }
            }
        }
    };

    return (
        !loadingUser && (
            <nav className="sidebar-wrapper">
                <Link href={"/"}>
                    <img src="/images/logo.png" className="sidebar-logo" alt="" />
                </Link>
                {getSideBar()}
            </nav>
        )
    );
};

export default SideBar;
