import UserPlus from "@/icons/UserPlus";
import { routeToCreateNewUserAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";
import Link from "next/link";

const AddNewUserOption = ({ pathname }: { pathname: string }) => {
  return (
    <Link
      href={routeToCreateNewUserAsAdmin()}
      className={`sidebar-option ${
        pathname.includes(routeToCreateNewUserAsAdmin()) && "selected"
      }`}
    >
      <UserPlus />
      <span>Nuevo usuario</span>
    </Link>
  );
};

export default AddNewUserOption;
