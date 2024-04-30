import UserProfile from "@/components/user/server_user/UserProfile";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
const UserProfilePage = () => {
    return (
        <WrapperWithSideBar>
            <UserProfile />
        </WrapperWithSideBar>
    );
};

export default UserProfilePage;
