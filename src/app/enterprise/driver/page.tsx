import DriverEnterprisePanel from "@/components/enterprises/driver/DriverEnterprisePanel";
import PageServerUserPermission from "@/components/permission_handlers/views/page/concrets/PageServerUserPermission";

const DriverEnterprisePage = () => {
    return (
        <PageServerUserPermission>
            <DriverEnterprisePanel />
        </PageServerUserPermission>
    );
};

export default DriverEnterprisePage;
