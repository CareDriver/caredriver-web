import SingleServiceDone from "@/components/done_services/SingleServiceDone";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleDriveServiceDidByUserPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <SingleServiceDone id={params.serviceid} type="driver" />
        </AdminWrapperWithSideBar>
    );
};

export default SingleDriveServiceDidByUserPage;
