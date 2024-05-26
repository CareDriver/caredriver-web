import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import ServiceReqsRenderer from "@/components/requests/services/ServiceReqsRenderer";

const ReqsMechanicServicePage = () => {
    return (
        <PageRequestPermission>
            <ServiceReqsRenderer type="laundry" />
        </PageRequestPermission>
    );
};

export default ReqsMechanicServicePage;
