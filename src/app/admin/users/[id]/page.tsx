import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";
import UserRenderer from "@/components/user/app_user/UserRenderer";

const SingleUserInformationPage = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <UserRenderer userId={params.id} />
        </PageUserInfoPermission>
    );
};

export default SingleUserInformationPage;
