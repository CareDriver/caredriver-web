import PagePermissionValidator from "@/components/permission/page/PagePermissionValidator";
import UsersRenderer from "@/components/users/UsersRenderer";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import { ROLES_TO_VIEW_USERS } from "@/utils/validator/roles/RoleValidator";

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
