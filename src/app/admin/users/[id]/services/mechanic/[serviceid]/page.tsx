import SingleServiceDone from "@/components/done_services/SingleServiceDone";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const SingleMechanicServiceReqByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <SingleServiceDone id={params.serviceid} type="mechanic" />
        </PageUserInfoPermission>
    );
};

export default SingleMechanicServiceReqByUser;
