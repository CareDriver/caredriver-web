import DriverEnterprisePanel from "@/components/enterprises/driver/DriverEnterprisePanel";
import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";

const DriverEnterprisePage = () => {
    return (
        <PageServerUserPermission>
            <DriverEnterprisePanel />
        </PageServerUserPermission>
    );
};

export default DriverEnterprisePage;
