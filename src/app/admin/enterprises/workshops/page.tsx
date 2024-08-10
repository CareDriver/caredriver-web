import EnterpriseListForAdmins from "@/components/enterprises/admin/EnterpriseListForAdmins";
import PageEnterprisePermission from "@/components/permission_handlers/page/concrets/PageEnterprisePermission";

const WorkshopListViewerPageForAdmin = () => {
    return (
        <PageEnterprisePermission>
            <EnterpriseListForAdmins type="mechanical" />;
        </PageEnterprisePermission>
    );
};

export default WorkshopListViewerPageForAdmin;
