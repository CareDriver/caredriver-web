import ServiceReqsRenderer from "@/components/requests/services/ServiceReqsRenderer";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ReqsMechanicServicePage = () => {
    return (
        <AdminWrapperWithSideBar>
            <ServiceReqsRenderer type="laundry" />
        </AdminWrapperWithSideBar>
    );
};

export default ReqsMechanicServicePage;
