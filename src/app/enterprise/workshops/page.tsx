import MechanicalWorkshopPanel from "@/components/enterprises/mechanicalworkshop/MechanicalWorkshopPanel";
import PageServerUserPermission from "@/components/permission_handlers/page/concrets/PageServerUserPermission";

const MechanicalworkshopPage = () => {
    return (
        <PageServerUserPermission>
            <MechanicalWorkshopPanel />
        </PageServerUserPermission>
    );
};

export default MechanicalworkshopPage;
