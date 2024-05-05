import AppUserProfile from "@/components/user/app_user/AppUserProfile";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const AdminSupportProfilePage = () => {
    return (
        <AdminWrapperWithSideBar>
            <AppUserProfile />
        </AdminWrapperWithSideBar>
    );
};

export default AdminSupportProfilePage;
