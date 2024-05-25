import EnterpriseEditByAdmin from "@/components/enterprises/admin/EnterpriseEditByAdmin";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const EditCranceByAdminPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <EnterpriseEditByAdmin id={params.id} type="laundry" />;
        </AdminWrapperWithSideBar>
    );
};

export default EditCranceByAdminPage;
