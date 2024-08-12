import PagePermissionValidator from "@/components/permission_handlers/views/page/PagePermissionValidator";
import AppUserProfile from "@/components/app_modules/user/app_user/AppUserProfile";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import { ROLES_TO_SEE_NO_USER_PROFILE } from "@/components/permission_handlers/models/PermissionsByUserRole";

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
