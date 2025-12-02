import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import GuardOfPage from "@/components/guards/views/page_guards/base/GuardOfPage";
import { ROLES_TO_SEE_NO_USER_PROFILE } from "@/components/guards/models/PermissionsByUserRole";
import UserProfileForAdmin from "@/components/app_modules/users/views/control_panels/UserProfileForAdmin";

const AdminSupportProfilePage = () => {
  return (
    <GuardOfPage roles={ROLES_TO_SEE_NO_USER_PROFILE}>
      <WrapperWithSideBar>
        <UserProfileForAdmin />
      </WrapperWithSideBar>
    </GuardOfPage>
  );
};

export default AdminSupportProfilePage;
