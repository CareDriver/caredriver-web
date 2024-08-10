import MechanicalWorkshopRegister from "@/components/enterprises/mechanicalworkshop/MechanicalWorkshopRegister";
import PageServerUserPermission from "@/components/permission_handlers/page/concrets/PageServerUserPermission";

const MechanicalworkshopRegisterPage = () => {
    return (
        <PageServerUserPermission>
            <MechanicalWorkshopRegister />
        </PageServerUserPermission>
    );
};

export default MechanicalworkshopRegisterPage;
