import ServicesServedByUser from "@/components/done_services/served/ServicesServedByUser";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const ListOfDriveServiceReqsByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <ServicesServedByUser serviceUserId={params.id} type="driver" />
        </PageUserInfoPermission>
    );
};

export default ListOfDriveServiceReqsByUser;
