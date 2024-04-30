import UserRenderer from "@/components/user/app_user/UserRenderer";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleUserInformationPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <UserRenderer userId={params.id} />
        </AdminWrapperWithSideBar>
    );
};

export default SingleUserInformationPage;
