import MechanicalWorkshopRegister from "@/components/enterprises/mechanicalworkshop/MechanicalWorkshopRegister";
import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";

const MechanicalworkshopRegisterPage = () => {
    return (
        <PageServerUserPermission>
            <MechanicalWorkshopRegister />
        </PageServerUserPermission>
    );
};

export default MechanicalworkshopRegisterPage;
