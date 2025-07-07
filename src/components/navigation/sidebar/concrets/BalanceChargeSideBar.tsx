import { UserRole } from "@/interfaces/UserInterface";
import UserRoleSideBar from "../sidebar_sections/UserRoleSideBar";
import UserGear from "@/icons/UserGear";
import NoServerUserProfileOp from "../sidebar_options/NoServerUserProfileOp";
import LogoutOption from "../sidebar_options/LogoutOption";
import UsersOption from "../sidebar_options/UsersOption";

const BalanceChargeSideBar = ({
  pathname,
  logout,
}: {
  pathname: string;
  logout: () => void;
}) => {
  return (
    <>
      <UserRoleSideBar role={UserRole.BalanceRecharge}>
        <UserGear />
      </UserRoleSideBar>
      <span className="text | medium bold | margin-bottom-15">Registros</span>
      <li className="sidebar-options">
        <UsersOption pathname={pathname} />
      </li>
      <span className="text | medium bold | margin-top-25 margin-bottom-15">
        Perfil
      </span>
      <li className="sidebar-options">
        <NoServerUserProfileOp pathname={pathname} />
        <LogoutOption logout={logout} />
      </li>
    </>
  );
};

export default BalanceChargeSideBar;
