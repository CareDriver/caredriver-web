import ServicesServedByUser from "@/components/done_services/served/ServicesServedByUser";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const ListOfTowServiceReqsByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <ServicesServedByUser serviceUserId={params.id} type="tow" />
        </PageUserInfoPermission>
    );
};

export default ListOfTowServiceReqsByUser;
