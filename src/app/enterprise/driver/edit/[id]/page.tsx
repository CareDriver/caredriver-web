import EnterpriseEditData from "@/components/enterprises/EnterpriseEditData";
import PageServerUserPermission from "@/components/permission_handlers/views/page/concrets/PageServerUserPermission";

const EditDriverEnterprisePage = ({ params }: { params: any }) => {
    return (
        <PageServerUserPermission>
            <EnterpriseEditData type="driver" id={params.id} />
        </PageServerUserPermission>
    );
};

export default EditDriverEnterprisePage;
