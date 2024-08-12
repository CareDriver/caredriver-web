import FormToSeeInfo from "@/components/permission_handlers/views/consent_forms/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission_handlers/views/page/concrets/PageUserInfoPermission";
import BaseRendererOfServicePerf from "@/components/app_modules/services_performed/view/single_views/BaseRendererOfServicePerf";

const SingleDriveServiceReqByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="userdriveservice" id={params.serviceid}>
                <BaseRendererOfServicePerf id={params.serviceid} type="driver" />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default SingleDriveServiceReqByUser;
