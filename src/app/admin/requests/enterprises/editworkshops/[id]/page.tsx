import SingleEnterpiseUpReq from "@/components/requests/enterprises/edit/SingleEnterpiseUpReq";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleWorkshopUpReqPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <SingleEnterpiseUpReq reqId={params.id} type="mechanical" />
        </AdminWrapperWithSideBar>
    );
};

export default SingleWorkshopUpReqPage;
