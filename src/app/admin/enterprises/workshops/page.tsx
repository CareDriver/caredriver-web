import EnterpriseListForAdmins from "@/components/enterprises/admin/EnterpriseListForAdmins";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const WorkshopListViewerPageForAdmin = () => {
    return (
        <AdminWrapperWithSideBar>
            <EnterpriseListForAdmins type="mechanical" />;
        </AdminWrapperWithSideBar>
    );
};

export default WorkshopListViewerPageForAdmin;
