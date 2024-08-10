import EnterpriseListForAdmins from "@/components/enterprises/admin/EnterpriseListForAdmins";
import PageEnterprisePermission from "@/components/permission_handlers/page/concrets/PageEnterprisePermission";

const DriverListViewerPageForAdmin = () => {
    return (
        <PageEnterprisePermission>
            <EnterpriseListForAdmins type="driver" />;
        </PageEnterprisePermission>
    );
};

export default DriverListViewerPageForAdmin;
