import EnterpriseListForAdmins from "@/components/enterprises/admin/EnterpriseListForAdmins";
import PageEnterprisePermission from "@/components/permission/page/concrets/PageEnterprisePermission";

const WorkshopListViewerPageForAdmin = () => {
    return (
        <PageEnterprisePermission>
            <EnterpriseListForAdmins type="mechanical" />;
        </PageEnterprisePermission>
    );
};

export default WorkshopListViewerPageForAdmin;
