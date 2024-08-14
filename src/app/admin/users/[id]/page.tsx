import FormToSeeInfo from "@/components/permission_handlers/views/consent_forms/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission_handlers/views/page/concrets/PageUserInfoPermission";
import UserRenderer from "@/components/app_modules/logged_user/app_user/UserRenderer";

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
