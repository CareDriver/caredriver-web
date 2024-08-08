import BaseRendererOfServicePerf from "@/components/services_performed/single_views/BaseRendererOfServicePerf";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const SingleTowServiceReqByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="usertowservice" id={params.serviceid}>
                <BaseRendererOfServicePerf id={params.serviceid} type="tow" />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default SingleTowServiceReqByUser;
