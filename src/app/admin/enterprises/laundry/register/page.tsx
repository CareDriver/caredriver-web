import LaundryRegistrationByAdmin from "@/components/enterprises/laundry/LaundryRegistrationByAdmin";
import PageEnterprisePermission from "@/components/permission/page/concrets/PageEnterprisePermission";
const RegisterLaundryByAdminPage = () => {
    return (
        <PageEnterprisePermission>
            <LaundryRegistrationByAdmin />;
        </PageEnterprisePermission>
    );
};

export default RegisterLaundryByAdminPage;
