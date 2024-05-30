import AddressCar from "@/icons/AddressCar";
import Bullhorn from "@/icons/Bullhorn";
import Camera from "@/icons/Camera";
import Car from "@/icons/Car";
import MechanicReq from "@/icons/MechanicReq";
import Soap from "@/icons/Soap";
import TowReq from "@/icons/TowReq";
import Truck from "@/icons/Truck";
import Wrench from "@/icons/Wrench";
import Link from "next/link";

const RequestsSection = ({ pathname }: { pathname: string }) => {
    return (
        <>
            <span className="text | medium bolder | margin-bottom-15">Solicitudes</span>
            <li className="sidebar-options | margin-bottom-25">
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
                    className={`sidebar-option ${pathname.includes("tow") && "selected"}`}
                >
                    <Truck />
                    <span>Grua</span>
                </Link>
                <Link
                    href={"/admin/requests/services/laundry"}
                    className={`sidebar-option ${
                        pathname.includes("laundry") && "selected"
                    }`}
                >
                    <Soap />
                    <span>Lavadero</span>
                </Link>
                <div>
                    <i className="separator-horizontal"></i>
                </div>
                <Link
                    href={"/admin/requests/enterprises/workshops"}
                    className={`sidebar-option lb-icon ${
                        pathname.includes("/requests/enterprises/workshops") && "selected"
                    }`}
                >
                    <MechanicReq />
                    <span>Nuevos Talleres</span>
                </Link>
                <Link
                    href={"/admin/requests/enterprises/editworkshops"}
                    className={`sidebar-option lb-icon ${
                        pathname.includes("requests/enterprises/editworkshops") &&
                        "selected"
                    }`}
                >
                    <MechanicReq />
                    <span>Editar Talleres</span>
                </Link>
                <Link
                    href={"/admin/requests/enterprises/cranes"}
                    className={`sidebar-option ${
                        pathname.includes("/requests/enterprises/cranes") && "selected"
                    }`}
                >
                    <TowReq />
                    <span>Nuevas Emp. de Grua</span>
                </Link>
                <Link
                    href={"/admin/requests/enterprises/editcranes"}
                    className={`sidebar-option ${
                        pathname.includes("requests/enterprises/editcranes") && "selected"
                    }`}
                >
                    <TowReq />
                    <span>Editar Emp. de Grua</span>
                </Link>
                <Link
                    href={"/admin/requests/enterprises/laundry"}
                    className={`sidebar-option ${
                        pathname.includes("/requests/enterprises/laundry") && "selected"
                    }`}
                >
                    <Soap />
                    <span>Nuevos Lavaderos</span>
                </Link>
                <Link
                    href={"/admin/requests/enterprises/editlaundry"}
                    className={`sidebar-option ${
                        pathname.includes("requests/enterprises/editlaundry") &&
                        "selected"
                    }`}
                >
                    <Soap />
                    <span>Editar Lavaderos</span>
                </Link>

                <div>
                    <i className="separator-horizontal"></i>
                </div>
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
                <Link
                    href={"/admin/requests/userinfo/branding"}
                    className={`sidebar-option ${
                        pathname.includes("branding") && "selected"
                    }`}
                >
                    <Bullhorn />
                    <span>Verificacion de Branding</span>
                </Link>
            </li>
        </>
    );
};

export default RequestsSection;
