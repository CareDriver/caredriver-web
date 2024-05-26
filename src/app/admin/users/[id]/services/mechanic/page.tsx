import ServicesServedByUser from "@/components/done_services/served/ServicesServedByUser";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const ListOfMechanicServiceReqsByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <ServicesServedByUser serviceUserId={params.id} type="mechanic" />
        </PageUserInfoPermission>
    );
};

export default ListOfMechanicServiceReqsByUser;
