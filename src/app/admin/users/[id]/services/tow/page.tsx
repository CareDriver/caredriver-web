import ServicesServedByUser from "@/components/done_services/served/ServicesServedByUser";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfTowServiceReqsByUser = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <ServicesServedByUser serviceUserId={params.id} type="tow" />
        </AdminWrapperWithSideBar>
    );
};

export default ListOfTowServiceReqsByUser;
