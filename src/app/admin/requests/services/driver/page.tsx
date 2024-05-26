import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import ServiceReqsRenderer from "@/components/requests/services/ServiceReqsRenderer";

const ReqsDriveServicePage = () => {
    return (
        <PageRequestPermission>
            <ServiceReqsRenderer type="driver" />
        </PageRequestPermission>
    );
};

export default ReqsDriveServicePage;
