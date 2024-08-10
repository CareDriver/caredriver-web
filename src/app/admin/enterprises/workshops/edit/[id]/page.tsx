import EnterpriseEditByAdmin from "@/components/enterprises/admin/EnterpriseEditByAdmin";
import PageEnterprisePermission from "@/components/permission_handlers/page/concrets/PageEnterprisePermission";

const EditWorkshopByAdminPage = ({ params }: { params: any }) => {
    return (
        <PageEnterprisePermission>
            <EnterpriseEditByAdmin id={params.id} type="mechanical" />;
        </PageEnterprisePermission>
    );
};

export default EditWorkshopByAdminPage;
