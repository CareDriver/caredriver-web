import Building from "@/icons/Building";
import Soap from "@/icons/Soap";
import Taxi from "@/icons/Taxi";
import Warehouse from "@/icons/Warehouse";
import Link from "next/link";

const EnterpriseRegistersSection = ({ pathname }: { pathname: string }) => {
    return (
        <li className="sidebar-options | margin-bottom-25">
            <Link
                href={"/admin/enterprises/driver"}
                className={`sidebar-option ${
                    pathname.includes("/admin/enterprises/drive") && "selected"
                }`}
            >
                <Taxi />
                <span>Empresas de Choferes</span>
            </Link>
            <Link
                href={"/admin/enterprises/workshops"}
                className={`sidebar-option ${
                    pathname.includes("workshops") &&
                    !pathname.includes("users") &&
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
                    !pathname.includes("users") &&
                    !pathname.includes("requests") &&
                    "selected"
                }`}
            >
                <Building />
                <span>Empresas de Grúa</span>
            </Link>
            <Link
                href={"/admin/enterprises/laundry"}
                className={`sidebar-option ${
                    pathname.includes("laundry") &&
                    !pathname.includes("users") &&
                    !pathname.includes("requests") &&
                    "selected"
                }`}
            >
                <Soap />
                <span>Lavaderos</span>
            </Link>
        </li>
    );
};

export default EnterpriseRegistersSection;
