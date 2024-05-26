import ServicesRequestedByUser from "@/components/done_services/requested/ServicesRequestedByUser";
import PageUserInfoPermission from "@/components/permission/page/concrets/PageUserInfoPermission";

const ListOfMechanicServiceDoneByUser = ({ params }: { params: any }) => {
    return (
        <PageUserInfoPermission>
            <ServicesRequestedByUser serviceUserId={params.id} type="mechanic" />
        </PageUserInfoPermission>
    );
};

export default ListOfMechanicServiceDoneByUser;
