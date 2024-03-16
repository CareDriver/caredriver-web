import DriveService from "@/components/services/drive/DriveService";
import ServiceWrapper from "@/components/services/ServiceWrapper";

const DrivePage = () => {
    return (
        <ServiceWrapper>
            <DriveService />
        </ServiceWrapper>
    );
};

export default DrivePage;
