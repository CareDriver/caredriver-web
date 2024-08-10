import UserRegistration from "@/components/auth/UserRegistration";
import PagePermissionValidator from "@/components/permission_handlers/page/PagePermissionValidator";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import { ROLES_TO_ADD_USERS } from "@/utils/validator/roles/RoleValidator";

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
