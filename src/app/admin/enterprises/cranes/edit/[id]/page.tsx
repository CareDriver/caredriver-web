import EnterpriseEditByAdmin from "@/components/enterprises/admin/EnterpriseEditByAdmin";
import PageEnterprisePermission from "@/components/permission_handlers/page/concrets/PageEnterprisePermission";

const EditCranceByAdminPage = ({ params }: { params: any }) => {
    return (
        <PageEnterprisePermission>
            <EnterpriseEditByAdmin id={params.id} type="tow" />;
        </PageEnterprisePermission>
    );
};

export default EditCranceByAdminPage;
