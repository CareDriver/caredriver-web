import EnterpriseEditData from "@/components/enterprises/EnterpriseEditData";
import PageServerUserPermission from "@/components/permission_handlers/page/concrets/PageServerUserPermission";

const EditCrangePage = ({ params }: { params: any }) => {
    return (
        <PageServerUserPermission>
            <EnterpriseEditData type="tow" id={params.id} />
        </PageServerUserPermission>
    );
};

export default EditCrangePage;
