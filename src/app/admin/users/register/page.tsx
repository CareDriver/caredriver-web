import UserRegistration from "@/components/auth/UserRegistration";
import PagePermissionValidator from "@/components/permission_handlers/views/page/PagePermissionValidator";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import { ROLES_TO_ADD_USERS } from "@/components/permission_handlers/models/PermissionsByUserRole";

const RegisterNewUserPage = () => {
    return (
        <PagePermissionValidator roles={ROLES_TO_ADD_USERS}>
            <WrapperWithSideBar>
                <UserRegistration />
            </WrapperWithSideBar>
        </PagePermissionValidator>
    );
};

export default RegisterNewUserPage;
