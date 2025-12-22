import UserPlus from "@/icons/UserPlus";
import Users from "@/icons/Users";
import {
  routeToAllUsersAsAdmin,
  routeToCreateNewUserAsAdmin,
} from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";
import Link from "next/link";

const RegisterSection = ({ pathname }: { pathname: string }) => {
  return (
    <li className="sidebar-options">
      <Link
        href={routeToAllUsersAsAdmin()}
        className={`sidebar-option ${
          (pathname.includes("users") || pathname.includes("service")) &&
          "selected"
        }`}
      >
        <Users />
        <span>Usuarios</span>
      </Link>
      <Link
        href={routeToCreateNewUserAsAdmin()}
        className={`sidebar-option ${
          pathname.includes(routeToCreateNewUserAsAdmin()) && "selected"
        }`}
      >
        <UserPlus />
        <span>Nuevo usuario</span>
      </Link>
    </li>
  );
};

export default RegisterSection;
