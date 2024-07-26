import DriverEnterpriseRegistration from "@/components/enterprises/driver/DriverEnterpriseRegistration";
import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";

const DriverEnterpriseRegisterPage = () => {
    return (
        <PageServerUserPermission>
            <DriverEnterpriseRegistration />
        </PageServerUserPermission>
    );
};

export default DriverEnterpriseRegisterPage;
