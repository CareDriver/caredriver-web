import Building from "@/icons/Building";
import Soap from "@/icons/Soap";
import Taxi from "@/icons/Taxi";
import Warehouse from "@/icons/Warehouse";
import { routeToAllEnterprisesAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import Link from "next/link";

const EnterpriseRegistersSection = ({ pathname }: { pathname: string }) => {
    return (
        <li className="sidebar-options | margin-bottom-25">
            <Link
                href={routeToAllEnterprisesAsAdmin("driver")}
                className={`sidebar-option ${
                    pathname.includes(routeToAllEnterprisesAsAdmin("driver")) &&
                    "selected"
                }`}
            >
                <Taxi />
                <span>Empresas de Choferes</span>
            </Link>
            <Link
                href={routeToAllEnterprisesAsAdmin("mechanical")}
                className={`sidebar-option ${
                    pathname.includes(
                        routeToAllEnterprisesAsAdmin("mechanical"),
                    ) && "selected"
                }`}
            >
                <Warehouse />
                <span>Talleres</span>
            </Link>
            <Link
                href={routeToAllEnterprisesAsAdmin("tow")}
                className={`sidebar-option ${
                    pathname.includes(routeToAllEnterprisesAsAdmin("tow")) &&
                    "selected"
                }`}
            >
                <Building />
                <span>Empresas de Grúa</span>
            </Link>
            <Link
                href={routeToAllEnterprisesAsAdmin("laundry")}
                className={`sidebar-option ${
                    pathname.includes(
                        routeToAllEnterprisesAsAdmin("laundry"),
                    ) && "selected"
                }`}
            >
                <Soap />
                <span>Lavaderos</span>
            </Link>
        </li>
    );
};

export default EnterpriseRegistersSection;
