import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";
import UserProfile from "@/components/user/server_user/UserProfile";

const UserProfilePage = () => {
    return (
        <PageServerUserPermission>
            <UserProfile />
        </PageServerUserPermission>
    );
};

export default UserProfilePage;
