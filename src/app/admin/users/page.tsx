import ListOfAllUsersWithSearcher from "@/components/app_modules/users/views/list_of_cards/ListOfAllUsersWithSearcher";
import { ROLES_TO_VIEW_USERS } from "@/components/guards/models/PermissionsByUserRole";
import GuardOfPage from "@/components/guards/views/page_guards/base/GuardOfPage";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";

const ListOfUsersOntheApplicationPage = () => {
    return (
        <GuardOfPage roles={ROLES_TO_VIEW_USERS}>
            <WrapperWithSideBar>
                <ListOfAllUsersWithSearcher />
            </WrapperWithSideBar>
        </GuardOfPage>
    );
};

export default ListOfUsersOntheApplicationPage;
