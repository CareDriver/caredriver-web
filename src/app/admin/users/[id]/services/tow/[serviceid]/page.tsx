import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";
import BaseRendererOfServicePerf from "@/components/services_performed/view/single_views/BaseRendererOfServicePerf";

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
