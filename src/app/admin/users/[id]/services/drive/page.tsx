import ServicesServedByUser from "@/components/done_services/served/ServicesServedByUser";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfDriveServiceReqsByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <ServicesServedByUser serviceUserId={params.id} type="driver" />
        </AdminWrapperWithSideBar>
    );
};

export default ListOfDriveServiceReqsByUser;
