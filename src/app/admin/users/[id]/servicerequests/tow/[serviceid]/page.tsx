import FormToSeeInfo from "@/components/permission_handlers/views/consent_forms/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission_handlers/views/page/concrets/PageUserInfoPermission";
import BaseRendererOfServicePerf from "@/components/app_modules/services_performed/view/single_views/BaseRendererOfServicePerf";

const SingleTowServiceDidByUserPage = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="usertowserreq" id={params.serviceid}>
                <BaseRendererOfServicePerf id={params.serviceid} type="tow" />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default SingleTowServiceDidByUserPage;
