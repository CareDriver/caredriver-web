"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";
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
import {
    checkPermission,
    ROLES_FOR_SERVER_USER_ACTIONS,
} from "@/utils/validator/roles/RoleValidator";
import Bars from "@/icons/Bars";

const SideBar = () => {
    const { loadingUser, user } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const pathname = usePathname();
    const navref = useRef(null);

    const openNav = () => {
        if (navref.current) {
            const nav = navref.current as HTMLElement;
            if (nav.classList.contains("open")) {
                nav.classList.remove("open");
            } else {
                nav.classList.add("open");
                // document.addEventListener("click", closeNav);
            }
        }
    };

    const closeNav = (e: MouseEvent) => {
        if (navref.current) {
            const nav = navref.current as HTMLElement;
            if (e.target !== navref.current) {
                nav.classList.remove("open");
                document.removeEventListener("click", closeNav);
            }
        }
    };

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
            <>
                <nav className="sidebar-wrapper-responsive">
                    <Link href={"/"} className="row-wrapper baseline">
                        <img src="/images/logo.png" className="sidebar-logo" alt="" />
                        <span className="sidebar-name">CAReDriver</span>
                    </Link>
                    <button
                        onClick={openNav}
                        className="icon-wrapper nav-open-button | white-icon lb touchable"
                    >
                        <Bars />
                    </button>
                </nav>
                <nav className="sidebar-wrapper" ref={navref}>
                    <Link href={"/"}>
                        <img src="/images/logo.png" className="sidebar-logo" alt="" />
                    </Link>
                    {getSideBar()}
                </nav>
            </>
        )
    );
};

export default SideBar;
