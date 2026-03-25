import "@/styles/components/sidebar.css";
import "@/styles/base/reset.css";
import { UserRole } from "@/interfaces/UserInterface";
import UserTie from "@/icons/UserTie";
import RequestsSection from "../sidebar_sections/RequestsSection";
import UserRoleSideBar from "../sidebar_sections/UserRoleSideBar";
import UsersOption from "../sidebar_options/UsersOption";
import AddNewUserOption from "../sidebar_options/AddNewUserOption";
import EnterpriseRegistersSection from "../sidebar_sections/EnterpriseRegistersSection";
import NoServerUserProfileOp from "../sidebar_options/NoServerUserProfileOp";
import LogoutOption from "../sidebar_options/LogoutOption";
import RedirectToService from "../sidebar_options/RedirectToService";
import ServicesOption from "../sidebar_options/ServicesOption";
import AdminPricingSettingsOption from "../sidebar_options/AdminPricingSettingsOption";

const AdminSideBar = ({
  pathname,
  logout,
}: {
  pathname: string;
  logout: () => void;
}) => {
  return (
    <>
      <UserRoleSideBar role={UserRole.Admin}>
        <UserTie />
      </UserRoleSideBar>
      <RequestsSection pathname={pathname} />

      <span className="text | white medium bold | margin-bottom-15">
        Registros
      </span>
      <li className="sidebar-options">
        <UsersOption pathname={pathname} />
        <AddNewUserOption pathname={pathname} />
        <RedirectToService />
        <ServicesOption pathname={pathname} />
        <AdminPricingSettingsOption pathname={pathname} />
      </li>
      <div>
        <i className="separator-horizontal green-opacity"></i>
      </div>
      <EnterpriseRegistersSection pathname={pathname} />

      <span className="text | white medium bold | margin-bottom-15">
        Perfil
      </span>

      <li className="sidebar-options">
        <NoServerUserProfileOp pathname={pathname} />
        <LogoutOption logout={logout} />
      </li>
    </>
  );
};

export default AdminSideBar;
