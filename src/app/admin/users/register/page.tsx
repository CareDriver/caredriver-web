import UserRegistration from "@/components/auth/UserRegistration";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const RegisterNewSupportUserPage = () => {
    return (
        <AdminWrapperWithSideBar>
            <UserRegistration />
        </AdminWrapperWithSideBar>
    );
};

export default RegisterNewSupportUserPage;
