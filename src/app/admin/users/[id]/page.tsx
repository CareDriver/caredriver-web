import FormToSeeInfo from "@/components/permission_handlers/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission_handlers/page/concrets/PageUserInfoPermission";
import UserRenderer from "@/components/app_modules/user/app_user/UserRenderer";

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
