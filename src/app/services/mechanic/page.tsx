import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";
import MechanicService from "@/components/services/mechanic/MechanicService";
import ServiceWrapper from "@/components/services/ServiceWrapper";

const MechanicPage = () => {
    return (
        <PageServerUserPermission>
            <ServiceWrapper>
                <MechanicService />
            </ServiceWrapper>
        </PageServerUserPermission>
    );
};

export default MechanicPage;
