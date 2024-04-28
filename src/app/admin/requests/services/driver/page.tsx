import ServiceReqsRenderer from "@/components/requests/services/ServiceReqsRenderer";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ReqsDriveServicePage = () => {
    return (
        <AdminWrapperWithSideBar>
            <ServiceReqsRenderer type="driver" />
        </AdminWrapperWithSideBar>
    );
};

export default ReqsDriveServicePage;
