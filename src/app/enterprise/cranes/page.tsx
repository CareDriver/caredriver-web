import CranesPanel from "@/components/enterprises/crane/CranesPanel";
import PageServerUserPermission from "@/components/permission_handlers/page/concrets/PageServerUserPermission";

const CraneworkshopPage = () => {
    return (
        <PageServerUserPermission>
            <CranesPanel />
        </PageServerUserPermission>
    );
};

export default CraneworkshopPage;
