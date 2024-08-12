import EnterpriseEditData from "@/components/enterprises/EnterpriseEditData";
import PageServerUserPermission from "@/components/permission_handlers/views/page/concrets/PageServerUserPermission";

const MechanicWorkshopEditPage = ({ params }: { params: any }) => {
    return (
        <PageServerUserPermission>
            <EnterpriseEditData type="mechanical" id={params.id} />
        </PageServerUserPermission>
    );
};

export default MechanicWorkshopEditPage;
