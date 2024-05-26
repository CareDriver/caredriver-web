import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";
import DriveService from "@/components/services/drive/DriveService";
import ServiceWrapper from "@/components/services/ServiceWrapper";

const DrivePage = () => {
    return (
        <PageServerUserPermission>
            <ServiceWrapper>
                <DriveService />
            </ServiceWrapper>
        </PageServerUserPermission>
    );
};

export default DrivePage;
