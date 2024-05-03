import SingleServiceDone from "@/components/done_services/SingleServiceDone";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleMechanicServiceDidByUserPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <SingleServiceDone id={params.serviceid} type="mechanic" />
        </AdminWrapperWithSideBar>
    );
};

export default SingleMechanicServiceDidByUserPage;
