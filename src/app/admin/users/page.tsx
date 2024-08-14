import PagePermissionValidator from "@/components/permission_handlers/views/page/PagePermissionValidator";
import UsersRenderer from "@/components/app_modules/logged_user/UsersRenderer";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import { ROLES_TO_VIEW_USERS } from "@/components/permission_handlers/models/PermissionsByUserRole";

const ListOfUsersOntheApplicationPage = () => {
    return (
        <PagePermissionValidator roles={ROLES_TO_VIEW_USERS}>
            <WrapperWithSideBar>
                <UsersRenderer />
            </WrapperWithSideBar>
        </PagePermissionValidator>
    );
};

export default ListOfUsersOntheApplicationPage;
