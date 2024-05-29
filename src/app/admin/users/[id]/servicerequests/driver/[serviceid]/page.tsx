import SingleServiceDone from "@/components/done_services/SingleServiceDone";
import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const SingleDriveServiceDidByUserPage = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <FormToSeeInfo target="userdriveserreq" id={params.serviceid}>
                <SingleServiceDone id={params.serviceid} type="driver" />
            </FormToSeeInfo>
        </PageUserInfoPermission>
    );
};

export default SingleDriveServiceDidByUserPage;
