import Building from "@/icons/Building";
import Car from "@/icons/Car";
import LocationDot from "@/icons/LocationDot";
import Soap from "@/icons/Soap";
import Truck from "@/icons/Truck";
import UserIcon from "@/icons/UserIcon";
import Warehouse from "@/icons/Warehouse";
import Wrench from "@/icons/Wrench";
import Link from "next/link";
import LogoutOption from "../sidebar_options/LogoutOption";
import Bullhorn from "@/icons/Bullhorn";

const ServerUserSideBar = ({
    pathname,
    logout,
}: {
    pathname: string;
    logout: () => void;
}) => {
    return (
        <>
            <span className="text | medium bolder | margin-top-25 margin-bottom-15">
                Servicios
            </span>
            <li className="sidebar-options margin-bottom-25">
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
                <Link
                    href={"/services/laundry"}
                    className={`sidebar-option ${
                        pathname.includes("/services/laundry") && "selected"
                    }`}
                >
                    <Soap />
                    <span>Lavadero</span>
                </Link>
            </li>
            <span className="text | medium bolder | margin-bottom-15">Registros</span>

            <li className="sidebar-options | margin-bottom-25">
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
                <Link
                    href={"/enterprise/laundry"}
                    className={`sidebar-option ${
                        pathname.includes("/enterprise/laundry") && "selected"
                    }`}
                >
                    <Soap />
                    <span>Lavaderos</span>
                </Link>
            </li>
            <span className="text | medium bolder | margin-bottom-15">Perfil</span>

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
                    href={"/user/branding"}
                    className={`sidebar-option ${
                        pathname.includes("branding") && "selected"
                    }`}
                >
                    <Bullhorn />
                    <span>Branding</span>
                </Link>
                <Link
                    href={"/user/update/location"}
                    className={`sidebar-option ${
                        pathname.includes("location") && "selected"
                    }`}
                >
                    <LocationDot />
                    <span>Ubicación</span>
                </Link>
                <LogoutOption logout={logout} />
            </li>
        </>
    );
};

export default ServerUserSideBar;
