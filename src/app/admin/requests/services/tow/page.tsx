import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import ServiceReqsRenderer from "@/components/requests/services/ServiceReqsRenderer";

const ReqsTowServicePage = () => {
    return (
        <PageRequestPermission>
            <ServiceReqsRenderer type="tow" />
        </PageRequestPermission>
    );
};

export default ReqsTowServicePage;
