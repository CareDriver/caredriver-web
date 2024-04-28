import ServiceReqsRenderer from "@/components/requests/services/ServiceReqsRenderer";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ReqsTowServicePage = () => {
    return (
        <AdminWrapperWithSideBar>
            <ServiceReqsRenderer type="tow" />
        </AdminWrapperWithSideBar>
    );
};

export default ReqsTowServicePage;
