import DriveService from "@/components/services/drive/DriveService";
import ServiceWrapper from "@/components/services/ServiceWrapper";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";

const DrivePage = () => {
    return (
        <WrapperWithSideBar>
            <ServiceWrapper>
                <DriveService />
            </ServiceWrapper>
        </WrapperWithSideBar>
    );
};

export default DrivePage;
