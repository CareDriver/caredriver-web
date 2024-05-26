import EnterpriseEditByAdmin from "@/components/enterprises/admin/EnterpriseEditByAdmin";
import PageEnterprisePermission from "@/components/permission/page/concrets/PageEnterprisePermission";

const EditLaundryByAdminPage = ({ params }: { params: any }) => {
    return (
        <PageEnterprisePermission>
            <EnterpriseEditByAdmin id={params.id} type="laundry" />;
        </PageEnterprisePermission>
    );
};

export default EditLaundryByAdminPage;
