import ServicesRequestedByUser from "@/components/done_services/requested/ServicesRequestedByUser";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfTowServiceDoneByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <ServicesRequestedByUser serviceUserId={params.id} type="tow" />
        </AdminWrapperWithSideBar>
    );
};

export default ListOfTowServiceDoneByUser;
