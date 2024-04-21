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
import LogOutIcon from "@/icons/LogOutIcon";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import MechanicReq from "@/icons/MechanicReq";
import TowReq from "@/icons/TowReq";
import Camera from "@/icons/Camera";
import AddressCar from "@/icons/AddressCar";
import Users from "@/icons/Users";
import { UserRole } from "@/interfaces/UserInterface";
import UserTie from "@/icons/UserTie";
const AdminSideBar = () => {
    const { logout } = useContext(AuthContext);
    const pathname = usePathname();
    const { loadingUser, user } = useContext(AuthContext);

    return (
        !loadingUser && (
            <nav className="sidebar-wrapper">
                <Link href={"/"}>
                    <img src="/images/logo.png" className="sidebar-logo" alt="" />
                </Link>
                <span className="icon-wrapper text | bolder medium green green-icon lb | margin-top-5 margin-bottom-25">
                    <UserTie />
                    {user.data?.role === UserRole.Admin ? "Administrador" : "Soporte"}
                </span>

                {user.data?.role === UserRole.Admin && (
                    <>
                        <span className="text | medium bolder | margin-bottom-15">
                            Solicitudes
                        </span>
                        <li className="sidebar-options">
                            <Link
                                href={"/admin/requests/services/driver"}
                                className={`sidebar-option ${
                                    pathname.includes("drive") && "selected"
                                }`}
                            >
                                <Car />
                                <span>Chofer</span>
                            </Link>
                            <Link
                                href={"/admin/requests/services/mechanic"}
                                className={`sidebar-option ${
                                    pathname.includes("mechanic") && "selected"
                                }`}
                            >
                                <Wrench />
                                <span>Mecanico</span>
                            </Link>
                            <Link
                                href={"/admin/requests/services/tow"}
                                className={`sidebar-option ${
                                    pathname.includes("tow") && "selected"
                                }`}
                            >
                                <Truck />
                                <span>Grua</span>
                            </Link>
                            <Link
                                href={"/admin/requests/enterprises/workshops"}
                                className={`sidebar-option lb-icon ${
                                    pathname.includes(
                                        "/requests/enterprises/workshops",
                                    ) && "selected"
                                }`}
                            >
                                <MechanicReq />
                                <span>Talleres</span>
                            </Link>
                            <Link
                                href={"/admin/requests/enterprises/cranes"}
                                className={`sidebar-option ${
                                    pathname.includes("/requests/enterprises/cranes") &&
                                    "selected"
                                }`}
                            >
                                <TowReq />
                                <span>Empresas de Grua</span>
                            </Link>
                            <Link
                                href={"/admin/requests/userinfo/photo"}
                                className={`sidebar-option ${
                                    pathname.includes("/userinfo/photo") && "selected"
                                }`}
                            >
                                <Camera />
                                <span>Nuevas Fotos de Perfil</span>
                            </Link>
                            <Link
                                href={"/admin/requests/userinfo/license"}
                                className={`sidebar-option ${
                                    pathname.includes("/userinfo/license") && "selected"
                                }`}
                            >
                                <AddressCar />
                                <span>Renovacion de Licencias</span>
                            </Link>
                        </li>
                        <div>
                            <i className="separator-horizontal"></i>
                        </div>
                    </>
                )}

                <li className="sidebar-options">
                    <Link
                        href={"/admin/users"}
                        className={`sidebar-option ${
                            pathname.includes("users") && "selected"
                        }`}
                    >
                        <Users />
                        <span>Usuarios</span>
                    </Link>
                </li>
                <div>
                    <i className="separator-horizontal"></i>
                </div>
                <li className="sidebar-options">
                    <Link
                        href={"/admin/enterprises/workshops"}
                        className={`sidebar-option ${
                            pathname.includes("workshops") &&
                            !pathname.includes("requests") &&
                            "selected"
                        }`}
                    >
                        <Warehouse />
                        <span>Talleres</span>
                    </Link>
                    <Link
                        href={"/admin/enterprises/cranes"}
                        className={`sidebar-option ${
                            pathname.includes("cranes") &&
                            !pathname.includes("requests") &&
                            "selected"
                        }`}
                    >
                        <Building />
                        <span>Empresas de Grua</span>
                    </Link>
                </li>
                <div>
                    <i className="separator-horizontal"></i>
                </div>
                <li className="sidebar-options">
                    <Link
                        href={"/admin/profile"}
                        className={`sidebar-option ${
                            pathname.includes("/admin/profile") && "selected"
                        }`}
                    >
                        <UserIcon />
                        <span>Mi Perfil</span>
                    </Link>
                    <button onClick={logout} className={`sidebar-option`}>
                        <LogOutIcon />
                        <span>Log out</span>
                    </button>
                </li>
            </nav>
        )
    );
};

export default AdminSideBar;
