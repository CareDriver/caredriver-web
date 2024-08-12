import EnterpriseListForAdmins from "@/components/enterprises/admin/EnterpriseListForAdmins";
import PageEnterprisePermission from "@/components/permission_handlers/views/page/concrets/PageEnterprisePermission";

const CraneListViewerPageForAdmin = () => {
    return (
        <PageEnterprisePermission>
            <EnterpriseListForAdmins type="tow" />;
        </PageEnterprisePermission>
    );
};

export default CraneListViewerPageForAdmin;
