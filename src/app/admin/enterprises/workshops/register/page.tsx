import WorkshopRegisterByAdmin from "@/components/enterprises/mechanicalworkshop/WorkshopRegisterByAdmin";
import PageEnterprisePermission from "@/components/permission/page/concrets/PageEnterprisePermission";

const RegisterWorkshopByAdminPage = () => {
    return (
        <PageEnterprisePermission>
            <WorkshopRegisterByAdmin />;
        </PageEnterprisePermission>
    );
};

export default RegisterWorkshopByAdminPage;
