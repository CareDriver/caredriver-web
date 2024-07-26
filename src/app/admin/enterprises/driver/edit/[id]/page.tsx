import EnterpriseEditByAdmin from "@/components/enterprises/admin/EnterpriseEditByAdmin";
import PageEnterprisePermission from "@/components/permission/page/concrets/PageEnterprisePermission";

const EditDriverByAdminPage = ({ params }: { params: any }) => {
    return (
        <PageEnterprisePermission>
            <EnterpriseEditByAdmin id={params.id} type="driver" />;
        </PageEnterprisePermission>
    );
};

export default EditDriverByAdminPage;
