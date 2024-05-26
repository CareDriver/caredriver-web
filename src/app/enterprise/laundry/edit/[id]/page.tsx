import EnterpriseEditData from "@/components/enterprises/EnterpriseEditData";
import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";

const EditLaundryEnterprisePage = ({ params }: { params: any }) => {
    return (
        <PageServerUserPermission>
            <EnterpriseEditData type="laundry" id={params.id} />
        </PageServerUserPermission>
    );
};

export default EditLaundryEnterprisePage;
