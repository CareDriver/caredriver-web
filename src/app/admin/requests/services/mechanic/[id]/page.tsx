import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import SingleServiceReq from "@/components/requests/services/SingleServiceReq";

const SingleMechanicReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <SingleServiceReq reqId={params.id} type="mechanic" />
        </PageRequestPermission>
    );
};

export default SingleMechanicReqPage;
