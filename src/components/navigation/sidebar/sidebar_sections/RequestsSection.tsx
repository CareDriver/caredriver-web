import AddressCar from "@/icons/AddressCar";
import Building from "@/icons/Building";
import Camera from "@/icons/Camera";
import Car from "@/icons/Car";
import Repeat from "@/icons/Repeat";
import Soap from "@/icons/Soap";
import Taxi from "@/icons/Taxi";
import Truck from "@/icons/Truck";
import Warehouse from "@/icons/Warehouse";
import Wrench from "@/icons/Wrench";
import { routeToRequestsToEditEnterpriseAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import { routeToUserRequestsToRenewPhotoAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";
import {
    routeToRequestsToBeUserServerAsAdmin,
    routeToRequestsToRenewLicenseAsAdmin,
    routeToUserRequestsToChangeEnterpriseAsAdmin,
} from "@/utils/route_builders/as_admin/RouteBuilderForUserServerAsAdmin";
import Link from "next/link";

const RequestsSection = ({ pathname }: { pathname: string }) => {
    return (
        <>
            <span className="text | medium bolder | margin-bottom-15">
                Solicitudes
            </span>
            <li className="sidebar-options | margin-bottom-25">
                <Link
                    href={routeToRequestsToBeUserServerAsAdmin("driver")}
                    className={`sidebar-option ${
                        pathname.includes(
                            routeToRequestsToBeUserServerAsAdmin("driver"),
                        ) && "selected"
                    }`}
                >
                    <Car />
                    <span>Chofer</span>
                </Link>
                <Link
                    href={routeToRequestsToBeUserServerAsAdmin("mechanical")}
                    className={`sidebar-option ${
                        pathname.includes(
                            routeToRequestsToBeUserServerAsAdmin("mechanical"),
                        ) && "selected"
                    }`}
                >
                    <Wrench />
                    <span>Mecánico</span>
                </Link>
                <Link
                    href={routeToRequestsToBeUserServerAsAdmin("tow")}
                    className={`sidebar-option lb-icon ${
                        pathname.includes(
                            routeToRequestsToBeUserServerAsAdmin("tow"),
                        ) && "selected"
                    }`}
                >
                    <Truck />
                    <span>Operador de Grúa</span>
                </Link>
                <Link
                    href={routeToRequestsToBeUserServerAsAdmin("laundry")}
                    className={`sidebar-option ${
                        pathname.includes(
                            routeToRequestsToBeUserServerAsAdmin("laundry"),
                        ) && "selected"
                    }`}
                >
                    <Soap />
                    <span>Lavadero</span>
                </Link>
                <div>
                    <i className="separator-horizontal"></i>
                </div>
                {/* <Link
                    href={""}
                    className={`sidebar-option ${
                        pathname.includes("/requests/enterprises/driver") &&
                        "selected"
                    }`}
                >
                    <Taxi />
                    <span>Nuevas Emp. de Choferes</span>
                </Link> */}

                <Link
                    href={routeToRequestsToEditEnterpriseAsAdmin("driver")}
                    className={`sidebar-option ${
                        pathname.includes(
                            routeToRequestsToEditEnterpriseAsAdmin("driver"),
                        ) && "selected"
                    }`}
                >
                    <Taxi />
                    <span>Editar Emp. de Choferes</span>
                </Link>
                {/* <Link
                    href={""}
                    className={`sidebar-option lb-icon ${
                        pathname.includes("/requests/enterprises/workshops") &&
                        "selected"
                    }`}
                >
                    <MechanicReq />
                    <span>Nuevos Talleres</span>
                </Link> */}
                <Link
                    href={routeToRequestsToEditEnterpriseAsAdmin("mechanical")}
                    className={`sidebar-option ${
                        pathname.includes(
                            routeToRequestsToEditEnterpriseAsAdmin(
                                "mechanical",
                            ),
                        ) && "selected"
                    }`}
                >
                    <Warehouse />
                    Editar Talleres
                </Link>
                {/*  <Link
                    href={""}
                    className={`sidebar-option ${
                        pathname.includes("/requests/enterprises/cranes") &&
                        "selected"
                    }`}
                >
                    <TowReq />
                    <span>Nuevas Emp. de Grúa</span>
                </Link> */}
                <Link
                    href={routeToRequestsToEditEnterpriseAsAdmin("tow")}
                    className={`sidebar-option ${
                        pathname.includes(
                            routeToRequestsToEditEnterpriseAsAdmin("tow"),
                        ) && "selected"
                    }`}
                >
                    <Building />
                    <span>Editar Emp. de Grúa</span>
                </Link>
                {/* <Link
                    href={""}
                    className={`sidebar-option ${
                        pathname.includes("/requests/enterprises/laundry") &&
                        "selected"
                    }`}
                >
                    <Soap />
                    <span>Nuevos Lavaderos</span>
                </Link> */}
                <Link
                    href={routeToRequestsToEditEnterpriseAsAdmin("laundry")}
                    className={`sidebar-option ${
                        pathname.includes(
                            routeToRequestsToEditEnterpriseAsAdmin("laundry"),
                        ) && "selected"
                    }`}
                >
                    <Soap />
                    <span>Editar Lavaderos</span>
                </Link>

                <div>
                    <i className="separator-horizontal"></i>
                </div>
                <Link
                    href={routeToUserRequestsToRenewPhotoAsAdmin()}
                    className={`sidebar-option ${
                        pathname.includes(
                            routeToUserRequestsToRenewPhotoAsAdmin(),
                        ) && "selected"
                    }`}
                >
                    <Camera />
                    <span>Nuevas Fotos de Perfil</span>
                </Link>
                <Link
                    href={routeToRequestsToRenewLicenseAsAdmin()}
                    className={`sidebar-option ${
                        pathname.includes(
                            routeToRequestsToRenewLicenseAsAdmin(),
                        ) && "selected"
                    }`}
                >
                    <AddressCar />
                    <span>Renovacion de Licencias</span>
                </Link>
                <Link
                    href={routeToUserRequestsToChangeEnterpriseAsAdmin()}
                    className={`sidebar-option ${
                        pathname.includes(
                            routeToUserRequestsToChangeEnterpriseAsAdmin(),
                        ) && "selected"
                    }`}
                >
                    <Repeat />
                    <span>Cambiar de empresa</span>
                </Link>
                {/*                 <Link
                    href={""}
                    className={`sidebar-option ${
                        pathname.includes("branding") && "selected"
                    }`}
                >
                    <Bullhorn />
                    <span>Verificación de Branding</span>
                </Link> */}
            </li>
        </>
    );
};

export default RequestsSection;
