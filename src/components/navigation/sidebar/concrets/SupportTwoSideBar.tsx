import "@/styles/components/sidebar.css";
import "@/styles/base/reset.css";
import { UserRole } from "@/interfaces/UserInterface";
import RequestsSection from "../sidebar_sections/RequestsSection";
import UserRoleSideBar from "../sidebar_sections/UserRoleSideBar";
import UsersOption from "../sidebar_options/UsersOption";
import NoServerUserProfileOp from "../sidebar_options/NoServerUserProfileOp";
import LogoutOption from "../sidebar_options/LogoutOption";
import UserGear from "@/icons/UserGear";
import RedirectToService from "../sidebar_options/RedirectToService";

const SupportTwoSideBar = ({
  pathname,
  logout,
}: {
  pathname: string;
  logout: () => void;
}) => {
  return (
    <>
      <UserRoleSideBar role={UserRole.SupportTwo}>
        <UserGear />
      </UserRoleSideBar>

      <RequestsSection pathname={pathname} />

      <span className="text | white medium bold | margin-bottom-15">
        Registros
      </span>
      <li className="sidebar-options">
        <UsersOption pathname={pathname} />
        <RedirectToService />
      </li>

      <span className="text | white medium bold | margin-top-25 margin-bottom-15">
        Perfil
      </span>

      <li className="sidebar-options">
        <NoServerUserProfileOp pathname={pathname} />
        <LogoutOption logout={logout} />
      </li>
    </>
  );
};

export default SupportTwoSideBar;
