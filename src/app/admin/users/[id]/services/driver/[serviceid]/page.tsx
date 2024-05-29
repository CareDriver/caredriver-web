import SingleServiceDone from "@/components/done_services/SingleServiceDone";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const SingleDriveServiceReqByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="userdriveservice" id={params.serviceid}>
                <SingleServiceDone id={params.serviceid} type="driver" />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default SingleDriveServiceReqByUser;
