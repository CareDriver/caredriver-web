import EnterpriseEditByAdmin from "@/components/enterprises/admin/EnterpriseEditByAdmin";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const EditWorkshopByAdminPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <EnterpriseEditByAdmin id={params.id} type="mechanical" />;
        </AdminWrapperWithSideBar>
    );
};

export default EditWorkshopByAdminPage;
