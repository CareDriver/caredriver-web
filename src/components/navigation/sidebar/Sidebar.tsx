"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";
import "@/styles/components/sidebar.css";
import "@/styles/base/reset.css";
import Car from "@/icons/Car";
import Wrench from "@/icons/Wrench";
import Truck from "@/icons/Truck";
import Warehouse from "@/icons/Warehouse";
import Building from "@/icons/Building";
import UserIcon from "@/icons/UserIcon";
import LocationDot from "@/icons/LocationDot";
import LogOutIcon from "@/icons/LogOutIcon";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const SideBar = () => {
    const { logout } = useContext(AuthContext);
    const pathname = usePathname();

    return (
        <nav className="sidebar-wrapper">
            <Link href={"/"}>
                <img src="/images/logo.png" className="sidebar-logo" alt="" />
            </Link>
            <span className="text | medium bolder | margin-top-25 margin-bottom-15">
                Servicios
            </span>
            <li className="sidebar-options">
                <Link
                    href={"/services/drive"}
                    className={`sidebar-option ${
                        (pathname.includes("drive") ||
                            pathname.includes("car") ||
                            pathname.includes("motorcycle")) &&
                        "selected"
                    }`}
                >
                    <Car />
                    <span>Chofer</span>
                </Link>
                <Link
                    href={"/services/mechanic"}
                    className={`sidebar-option ${
                        pathname.includes("mechanic") && "selected"
                    }`}
                >
                    <Wrench />
                    <span>Mecanico</span>
                </Link>
                <Link
                    href={"/services/tow"}
                    className={`sidebar-option ${pathname.includes("tow") && "selected"}`}
                >
                    <Truck />
                    <span>Grua</span>
                </Link>
            </li>
            <i className="separator-horizontal"></i>
            <li className="sidebar-options">
                <Link
                    href={"/enterprise/workshops"}
                    className={`sidebar-option ${
                        pathname.includes("workshops") && "selected"
                    }`}
                >
                    <Warehouse />
                    <span>Talleres</span>
                </Link>
                <Link
                    href={"/enterprise/cranes"}
                    className={`sidebar-option ${
                        pathname.includes("cranes") && "selected"
                    }`}
                >
                    <Building />
                    <span>Empresas de Grua</span>
                </Link>
            </li>
            <i className="separator-horizontal"></i>
            <li className="sidebar-options">
                <Link
                    href={"/user/profile"}
                    className={`sidebar-option ${
                        (pathname.includes("profile") || pathname.includes("photo")) &&
                        "selected"
                    }`}
                >
                    <UserIcon />
                    <span>Mi Perfil</span>
                </Link>
                <Link
                    href={"/user/update/location"}
                    className={`sidebar-option ${
                        pathname.includes("location") && "selected"
                    }`}
                >
                    <LocationDot />
                    <span>Ubicacion</span>
                </Link>
                <button onClick={logout} className={`sidebar-option`}>
                    <LogOutIcon />
                    <span>Log out</span>
                </button>
            </li>
        </nav>
    );
};

export default SideBar;
