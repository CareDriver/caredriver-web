import EnterpriseListForAdmins from "@/components/enterprises/admin/EnterpriseListForAdmins";
import PageEnterprisePermission from "@/components/permission_handlers/views/page/concrets/PageEnterprisePermission";

const LaundryListViewerPageForAdmin = () => {
    return (
        <PageEnterprisePermission>
            <EnterpriseListForAdmins type="laundry" />;
        </PageEnterprisePermission>
    );
};

export default LaundryListViewerPageForAdmin;
