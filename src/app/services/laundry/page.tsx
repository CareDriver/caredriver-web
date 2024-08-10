import PageServerUserPermission from "@/components/permission_handlers/page/concrets/PageServerUserPermission";
import LaundryService from "@/components/services/laundry/LaundryService";
import ServiceWrapper from "@/components/services/ServiceWrapper";

const MechanicPage = () => {
    return (
        <PageServerUserPermission>
            <ServiceWrapper>
                <LaundryService />
            </ServiceWrapper>
        </PageServerUserPermission>
    );
};

export default MechanicPage;
