import PageRequestPermission from "@/components/permission_handlers/views/page/concrets/PageRequestPermission";
import ServiceReqsRenderer from "@/components/requests/services/ServiceReqsRenderer";

const ReqsMechanicServicePage = () => {
    return (
        <PageRequestPermission>
            <ServiceReqsRenderer type="mechanic" />
        </PageRequestPermission>
    );
};

export default ReqsMechanicServicePage;
