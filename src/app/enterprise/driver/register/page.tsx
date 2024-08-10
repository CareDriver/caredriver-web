import DriverEnterpriseRegistration from "@/components/enterprises/driver/DriverEnterpriseRegistration";
import PageServerUserPermission from "@/components/permission_handlers/page/concrets/PageServerUserPermission";

const DriverEnterpriseRegisterPage = () => {
    return (
        <PageServerUserPermission>
            <DriverEnterpriseRegistration />
        </PageServerUserPermission>
    );
};

export default DriverEnterpriseRegisterPage;
