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
import Taxi from "@/icons/Taxi";
import {
    routeToRenewEnterpriseAsUser,
    routeToRequestToBeServerUserAsUser,
} from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";
import { routeToAllEnterprisesAsUser } from "@/utils/route_builders/as_user/RouteBuilderForEnterpriseAsUser";
import {
    routeToProfileAsUser,
    routeToRenewLocationAsUser,
    routeToRenewPhotoAsUser,
} from "@/utils/route_builders/as_user/RouteBuilderForProfileAsUser";
import Camera from "@/icons/Camera";

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
                    href={routeToRequestToBeServerUserAsUser("driver")}
                    className={`sidebar-option ${
                        (pathname.includes(
                            routeToRequestToBeServerUserAsUser("driver"),
                        ) ||
                            pathname.includes(
                                routeToRenewEnterpriseAsUser("driver"),
                            )) &&
                        "selected"
                    }`}
                >
                    <Car />
                    <span>Chofer</span>
                </Link>
                <Link
                    href={routeToRequestToBeServerUserAsUser("mechanical")}
                    className={`sidebar-option ${
                        (pathname.includes(
                            routeToRequestToBeServerUserAsUser("mechanical"),
                        ) ||
                            pathname.includes(
                                routeToRenewEnterpriseAsUser("mechanical"),
                            )) &&
                        "selected"
                    }`}
                >
                    <Wrench />
                    <span>Mecánico</span>
                </Link>
                <Link
                    href={routeToRequestToBeServerUserAsUser("tow")}
                    className={`sidebar-option lb-icon ${
                        (pathname.includes(
                            routeToRequestToBeServerUserAsUser("tow"),
                        ) ||
                            pathname.includes(
                                routeToRenewEnterpriseAsUser("tow"),
                            )) &&
                        "selected"
                    }`}
                >
                    <Truck />
                    <span>Operador de Grúa</span>
                </Link>
                <Link
                    href={routeToRequestToBeServerUserAsUser("laundry")}
                    className={`sidebar-option ${
                        (pathname.includes(
                            routeToRequestToBeServerUserAsUser("laundry"),
                        ) ||
                            pathname.includes(
                                routeToRenewEnterpriseAsUser("laundry"),
                            )) &&
                        "selected"
                    }`}
                >
                    <Soap />
                    <span>Lavadero</span>
                </Link>
            </li>
            <span className="text | medium bolder | margin-bottom-15">
                Registros
            </span>

            <li className="sidebar-options | margin-bottom-25">
                <Link
                    href={routeToAllEnterprisesAsUser("driver")}
                    className={`sidebar-option ${
                        pathname.includes(
                            routeToAllEnterprisesAsUser("driver"),
                        ) && "selected"
                    }`}
                >
                    <Taxi />
                    <span>Empresas de Choferes</span>
                </Link>
                <Link
                    href={routeToAllEnterprisesAsUser("mechanical")}
                    className={`sidebar-option ${
                        pathname.includes(
                            routeToAllEnterprisesAsUser("mechanical"),
                        ) && "selected"
                    }`}
                >
                    <Warehouse />
                    <span>Talleres Mecánicos</span>
                </Link>
                <Link
                    href={routeToAllEnterprisesAsUser("tow")}
                    className={`sidebar-option ${
                        pathname.includes(routeToAllEnterprisesAsUser("tow")) &&
                        "selected"
                    }`}
                >
                    <Building />
                    <span>Empresas de Grúa</span>
                </Link>
                <Link
                    href={routeToAllEnterprisesAsUser("laundry")}
                    className={`sidebar-option ${
                        pathname.includes(
                            routeToAllEnterprisesAsUser("laundry"),
                        ) && "selected"
                    }`}
                >
                    <Soap />
                    <span>Lavaderos</span>
                </Link>
            </li>
            <span className="text | medium bolder | margin-bottom-15">
                Perfil
            </span>

            <li className="sidebar-options">
                <Link
                    href={routeToProfileAsUser()}
                    className={`sidebar-option ${
                        pathname === routeToProfileAsUser() && "selected"
                    }`}
                >
                    <UserIcon />
                    <span>Mi Perfil</span>
                </Link>

                <Link
                    href={routeToRenewPhotoAsUser()}
                    className={`sidebar-option ${
                        pathname === routeToRenewPhotoAsUser() && "selected"
                    }`}
                >
                    <Camera />
                    <span>Foto de Perfil</span>
                </Link>
                {/*                 <Link
                    href={""}
                    className={`sidebar-option ${
                        pathname.includes("branding") && "selected"
                    }`}
                >
                    <Bullhorn />
                    <span>Branding</span>
                </Link> */}
                <Link
                    href={routeToRenewLocationAsUser()}
                    className={`sidebar-option ${
                        pathname.includes(routeToRenewLocationAsUser()) &&
                        "selected"
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
