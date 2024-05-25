import SingleServiceReq from "@/components/requests/services/SingleServiceReq";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleMechanicReqPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <SingleServiceReq reqId={params.id} type="laundry" />
        </AdminWrapperWithSideBar>
    );
};

export default SingleMechanicReqPage;
