import PageRequestPermission from "@/components/permission_handlers/views/page/concrets/PageRequestPermission";
import ServiceReqsRenderer from "@/components/requests/services/ServiceReqsRenderer";

const ReqsLaundryServicePage = () => {
    return (
        <PageRequestPermission>
            <ServiceReqsRenderer type="laundry" />
        </PageRequestPermission>
    );
};

export default ReqsLaundryServicePage;
