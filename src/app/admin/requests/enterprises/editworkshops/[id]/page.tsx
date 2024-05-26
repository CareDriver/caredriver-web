import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import SingleEnterpiseUpReq from "@/components/requests/enterprises/edit/SingleEnterpiseUpReq";

const SingleWorkshopUpReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <SingleEnterpiseUpReq reqId={params.id} type="mechanical" />
        </PageRequestPermission>
    );
};

export default SingleWorkshopUpReqPage;
