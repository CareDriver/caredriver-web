import DriverRegistrationByAdmin from "@/components/enterprises/driver/DriverRegistrationByAdmin";
import PageEnterprisePermission from "@/components/permission_handlers/views/page/concrets/PageEnterprisePermission";

const RegisterDriverByAdminPage = () => {
    return (
        <PageEnterprisePermission>
            <DriverRegistrationByAdmin />;
        </PageEnterprisePermission>
    );
};

export default RegisterDriverByAdminPage;
