import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";
import UserRenderer from "@/components/user/app_user/UserRenderer";

const SingleUserInformationPage = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="userinfo" id={params.id}>
                <UserRenderer userId={params.id} />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default SingleUserInformationPage;
