import BaseRendererOfServicePerf from "@/components/services_performed/single_views/BaseRendererOfServicePerf";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const SingleMechanicServiceDidByUserPage = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="usermechanicserreq" id={params.serviceid}>
                <BaseRendererOfServicePerf id={params.serviceid} type="mechanic" />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default SingleMechanicServiceDidByUserPage;
