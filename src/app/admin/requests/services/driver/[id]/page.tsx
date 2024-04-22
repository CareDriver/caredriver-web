import SingleServiceReq from "@/components/requests/services/SingleServiceReq";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleDriveReqPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <SingleServiceReq reqId={params.id} type="driver" />
        </AdminWrapperWithSideBar>
    );
};

export default SingleDriveReqPage;
