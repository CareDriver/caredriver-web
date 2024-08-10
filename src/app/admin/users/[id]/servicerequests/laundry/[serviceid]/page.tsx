import FormToSeeInfo from "@/components/permission_handlers/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission_handlers/page/concrets/PageUserInfoPermission";
import BaseRendererOfServicePerf from "@/components/app_modules/services_performed/view/single_views/BaseRendererOfServicePerf";

const SingleDriveServiceDidByUserPage = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="userlaundryserreq" id={params.serviceid}>
                <BaseRendererOfServicePerf
                    id={params.serviceid}
                    type="laundry"
                />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default SingleDriveServiceDidByUserPage;
