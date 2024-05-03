import SingleServiceDone from "@/components/done_services/SingleServiceDone";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleDriveServiceReqByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <SingleServiceDone id={params.serviceid} type="driver" />
        </AdminWrapperWithSideBar>
    );
};

export default SingleDriveServiceReqByUser;
