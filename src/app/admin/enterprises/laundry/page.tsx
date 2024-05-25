import EnterpriseListForAdmins from "@/components/enterprises/admin/EnterpriseListForAdmins";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const CraneListViewerPageForAdmin = () => {
    return (
        <AdminWrapperWithSideBar>
            <EnterpriseListForAdmins type="laundry" />;
        </AdminWrapperWithSideBar>
    );
};

export default CraneListViewerPageForAdmin;
