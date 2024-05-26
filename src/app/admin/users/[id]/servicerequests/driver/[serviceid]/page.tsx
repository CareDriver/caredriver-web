import SingleServiceDone from "@/components/done_services/SingleServiceDone";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const SingleDriveServiceDidByUserPage = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <SingleServiceDone id={params.serviceid} type="driver" />
        </PageUserInfoPermission>
    );
};

export default SingleDriveServiceDidByUserPage;
