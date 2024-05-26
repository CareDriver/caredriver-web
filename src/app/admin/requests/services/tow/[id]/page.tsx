import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import SingleServiceReq from "@/components/requests/services/SingleServiceReq";

const SingleTowReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <SingleServiceReq reqId={params.id} type="tow" />
        </PageRequestPermission>
    );
};

export default SingleTowReqPage;
