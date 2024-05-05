import ServicesServedByUser from "@/components/done_services/served/ServicesServedByUser";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfMechanicServiceReqsByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <ServicesServedByUser serviceUserId={params.id} type="mechanic" />
        </AdminWrapperWithSideBar>
    );
};

export default ListOfMechanicServiceReqsByUser;
