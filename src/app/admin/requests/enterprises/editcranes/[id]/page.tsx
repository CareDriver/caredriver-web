import SingleEnterpiseUpReq from "@/components/requests/enterprises/edit/SingleEnterpiseUpReq";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleTowUpReqPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <SingleEnterpiseUpReq reqId={params.id} type="tow" />
        </AdminWrapperWithSideBar>
    );
};

export default SingleTowUpReqPage;
