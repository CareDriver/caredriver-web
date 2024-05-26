import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import SingleEnterpiseUpReq from "@/components/requests/enterprises/edit/SingleEnterpiseUpReq";

const SingleTowUpReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <SingleEnterpiseUpReq reqId={params.id} type="tow" />
        </PageRequestPermission>
    );
};

export default SingleTowUpReqPage;
