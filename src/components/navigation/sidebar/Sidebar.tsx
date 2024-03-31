"use client";

import { auth } from "@/firebase/FirebaseConfig";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

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

const SideBar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const logout = () => {
        auth.signOut()
            .then(() => {
                toast("Sesion cerrada existosamente");
                router.push("/");
            })
            .catch(() => {
                toast("Algo salio mal");
                router.push("/");
            });
    };

    return (
        <nav className="sidebar-wrapper">
            <Link href={"/"}>
                <img src="/images/logo.png" className="sidebar-logo" alt="" />
            </Link>
            <span className="text | medium bold | margin-top-25">Servicios</span>
            <li className="sidebar-options">
                <Link
                    href={"/services/drive"}
                    className={`sidebar-option ${
                        pathname.includes("drive") && "selected"
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
                    href={"/registration/mechanicalworkshop"}
                    className={`sidebar-option ${
                        pathname.includes("mechanicalworkshop") && "selected"
                    }`}
                >
                    <Warehouse />
                    <span>Talleres</span>
                </Link>
                <Link
                    href={"/registration/cranecompany"}
                    className={`sidebar-option ${
                        pathname.includes("cranecompany") && "selected"
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
                        pathname.includes("profile") && "selected"
                    }`}
                >
                    <UserIcon />
                    <span>Mi Perfil</span>
                </Link>
                <Link
                    href={"/user/profile"}
                    className={`sidebar-option ${
                        pathname.includes("profile") && "selected"
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
