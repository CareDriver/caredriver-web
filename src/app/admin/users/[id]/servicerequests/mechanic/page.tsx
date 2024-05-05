import ServicesRequestedByUser from "@/components/done_services/requested/ServicesRequestedByUser";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfMechanicServiceDoneByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <ServicesRequestedByUser serviceUserId={params.id} type="mechanic" />
        </AdminWrapperWithSideBar>
    );
};

export default ListOfMechanicServiceDoneByUser;
