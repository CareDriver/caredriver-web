import UserIcon from "@/icons/UserIcon";
import { routeToProfileAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForProfileAsAdmin";
import Link from "next/link";

const NoServerUserProfileOp = ({ pathname }: { pathname: string }) => {
    return (
        <Link
            href={routeToProfileAsAdmin()}
            className={`sidebar-option ${
                pathname.includes(routeToProfileAsAdmin()) && "selected"
            }`}
        >
            <UserIcon />
            <span>Mi Perfil</span>
        </Link>
    );
};

export default NoServerUserProfileOp;
