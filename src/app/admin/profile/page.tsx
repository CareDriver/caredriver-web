import PagePermissionValidator from "@/components/permission/page/PagePermissionValidator";
import AppUserProfile from "@/components/user/app_user/AppUserProfile";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import { ROLES_TO_SEE_NO_USER_PROFILE } from "@/utils/validator/roles/RoleValidator";

const AdminSupportProfilePage = () => {
    return (
        <PagePermissionValidator roles={ROLES_TO_SEE_NO_USER_PROFILE}>
            <WrapperWithSideBar>
                <AppUserProfile />
            </WrapperWithSideBar>
        </PagePermissionValidator>
    );
};

export default AdminSupportProfilePage;
