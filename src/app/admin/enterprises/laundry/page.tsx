import EnterpriseListForAdmins from "@/components/enterprises/admin/EnterpriseListForAdmins";
import PageEnterprisePermission from "@/components/permission/page/concrets/PageEnterprisePermission";

const LaundryListViewerPageForAdmin = () => {
    return (
        <PageEnterprisePermission>
            <EnterpriseListForAdmins type="laundry" />;
        </PageEnterprisePermission>
    );
};

export default LaundryListViewerPageForAdmin;
