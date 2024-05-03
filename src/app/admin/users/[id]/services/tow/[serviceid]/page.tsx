import SingleServiceDone from "@/components/done_services/SingleServiceDone";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleTowServiceReqByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <SingleServiceDone id={params.serviceid} type="tow" />
        </AdminWrapperWithSideBar>
    );
};

export default SingleTowServiceReqByUser;
