import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import PagePermissionValidator from "../PagePermissionValidator";
import { ROLES_FOR_SERVER_USER_ACTIONS } from "@/utils/validator/roles/RoleValidator";

const PageServerUserPermission = ({ children }: { children: React.ReactNode }) => {
    return (
        <PagePermissionValidator roles={ROLES_FOR_SERVER_USER_ACTIONS}>
            <WrapperWithSideBar>{children}</WrapperWithSideBar>
        </PagePermissionValidator>
    );
};

export default PageServerUserPermission;
