import CraneRegistrationByAdmin from "@/components/enterprises/crane/CraneRegistrationByAdmin";
import PageEnterprisePermission from "@/components/permission_handlers/page/concrets/PageEnterprisePermission";

const RegisterCraneByAdminPage = () => {
    return (
        <PageEnterprisePermission>
            <CraneRegistrationByAdmin />;
        </PageEnterprisePermission>
    );
};

export default RegisterCraneByAdminPage;
