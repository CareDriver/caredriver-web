"use client";

import { usePathname } from "next/navigation";

import "@/styles/components/sidebar.css";
import "@/styles/base/reset.css";
import { useContext, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";
import { UserRole } from "@/interfaces/UserInterface";
import AdminSideBar from "./concrets/AdminSideBar";
import ServerUserSideBar from "./concrets/ServerUserSideBar";
import SupportSideBar from "./concrets/SupportSideBar";
import SupportTwoSideBar from "./concrets/SupportTwoSideBar";
import BalanceChargeSideBar from "./concrets/BalanceChargeSideBar";
import Bars from "@/icons/Bars";
import { checkPermission } from "@/components/guards/validators/RoleValidator";
import { ROLES_FOR_SERVER_USER_ACTIONS } from "@/components/guards/models/PermissionsByUserRole";

const SideBar = () => {
    const { checkingUserAuth, user } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const pathname = usePathname();
    const navref = useRef(null);

    const toggleNav = () => {
        if (navref.current) {
            const nav = navref.current as HTMLElement;
            if (nav.classList.contains("open")) {
                closeNav(nav);
            } else {
                openNav(nav);
            }
        }
    };

    const openNav = (nav: HTMLElement) => {
        nav.classList.add("open");
        document.body.addEventListener("mousedown", (e) => {
            let node = e.target as Node;
            if (
                node !== nav &&
                node !== nav &&
                node !== nav &&
                !nav.contains(node)
            ) {
                closeNav(nav);
            }
        });
    };

    const closeNav = (nav: HTMLElement) => {
        nav.classList.remove("open");
    };

    const getSideBar = () => {
        if (user) {
            if (
                (pathname.includes("/user/userserver") ||
                    pathname.includes("/user/enterprise") ||
                    pathname.includes("/user/profile")) &&
                checkPermission(user.role, ROLES_FOR_SERVER_USER_ACTIONS)
            ) {
                return (
                    <ServerUserSideBar logout={logout} pathname={pathname} />
                );
            } else {
                switch (user.role) {
                    case UserRole.Admin:
                        return (
                            <AdminSideBar logout={logout} pathname={pathname} />
                        );
                    case UserRole.Support:
                        return (
                            <SupportSideBar
                                logout={logout}
                                pathname={pathname}
                            />
                        );
                    case UserRole.SupportTwo:
                        return (
                            <SupportTwoSideBar
                                logout={logout}
                                pathname={pathname}
                            />
                        );
                    case UserRole.BalanceRecharge:
                        return (
                            <BalanceChargeSideBar
                                logout={logout}
                                pathname={pathname}
                            />
                        );
                    default:
                        return (
                            <ServerUserSideBar
                                logout={logout}
                                pathname={pathname}
                            />
                        );
                }
            }
        }
    };

    return (
        !checkingUserAuth &&
        user && (
            <>
                <nav className="sidebar-wrapper-responsive">
                    <span className="row-wrapper baseline">
                        <img
                            src="/images/logo.png"
                            className="sidebar-logo"
                            alt=""
                        />
                        <span className="sidebar-name">CAReDriver</span>
                    </span>
                    <button
                        onClick={toggleNav}
                        className="icon-wrapper nav-open-button | white-icon lb touchable"
                    >
                        <Bars />
                    </button>
                </nav>
                <nav className="sidebar-wrapper" ref={navref}>
                    <img
                        src="/images/logo.png"
                        className="sidebar-logo"
                        alt=""
                    />
                    {getSideBar()}
                </nav>
            </>
        )
    );
};

export default SideBar;
