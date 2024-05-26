import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import SingleServiceReq from "@/components/requests/services/SingleServiceReq";

const SingleDriveReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <SingleServiceReq reqId={params.id} type="driver" />
        </PageRequestPermission>
    );
};

export default SingleDriveReqPage;
