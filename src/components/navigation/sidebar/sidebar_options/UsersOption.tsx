import Users from "@/icons/Users";
import {
    routeToAllUsersAsAdmin,
    routeToManageUserAsAdmin,
} from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";
import Link from "next/link";

const UsersOption = ({ pathname }: { pathname: string }) => {
    return (
        <Link
            href={routeToAllUsersAsAdmin()}
            className={`sidebar-option ${
                (pathname === routeToAllUsersAsAdmin() ||
                    pathname.includes(routeToManageUserAsAdmin(""))) &&
                "selected"
            }`}
        >
            <Users />
            <span>Usuarios</span>
        </Link>
    );
};

export default UsersOption;
