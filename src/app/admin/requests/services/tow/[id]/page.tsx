import SingleServiceReq from "@/components/requests/services/SingleServiceReq";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleTowReqPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <SingleServiceReq reqId={params.id} type="tow" />
        </AdminWrapperWithSideBar>
    );
};

export default SingleTowReqPage;
