import BaseRendererOfServicePerf from "@/components/services_performed/single_views/BaseRendererOfServicePerf";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const SingleDriveServiceReqByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="userlaundryservice" id={params.serviceid}>
                <BaseRendererOfServicePerf id={params.serviceid} type="laundry" />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default SingleDriveServiceReqByUser;
