import PageServerUserPermission from "@/components/permission_handlers/views/page/concrets/PageServerUserPermission";
import UserProfile from "@/components/app_modules/logged_user/server_user/UserProfile";

const UserProfilePage = () => {
    return (
        <PageServerUserPermission>
            <UserProfile />
        </PageServerUserPermission>
    );
};

export default UserProfilePage;
