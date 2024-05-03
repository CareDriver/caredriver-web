import ServicesRequestedByUser from "@/components/done_services/requested/ServicesRequestedByUser";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfDriveServiceDoneByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <ServicesRequestedByUser serviceUserId={params.id} type="driver" />
        </AdminWrapperWithSideBar>
    );
};

export default ListOfDriveServiceDoneByUser;
