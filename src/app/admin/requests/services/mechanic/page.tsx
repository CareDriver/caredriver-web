import ServiceReqsRenderer from "@/components/requests/services/ServiceReqsRenderer";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ReqsMechanicServicePage = () => {
    return (
        <AdminWrapperWithSideBar>
            <ServiceReqsRenderer type="mechanic" />
        </AdminWrapperWithSideBar>
    );
};

export default ReqsMechanicServicePage;
