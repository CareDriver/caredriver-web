import TowService from "@/components/services/tow/TowService";
import ServiceWrapper from "@/components/services/ServiceWrapper";
import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";

const TowPage = () => {
    return (
        <PageServerUserPermission>
            <ServiceWrapper>
                <TowService />
            </ServiceWrapper>
        </PageServerUserPermission>
    );
};

export default TowPage;
