import TowService from "@/components/services/tow/TowService";
import ServiceWrapper from "@/components/services/ServiceWrapper";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";

const TowPage = () => {
    return (
        <WrapperWithSideBar>
            <ServiceWrapper>
                <TowService />
            </ServiceWrapper>
        </WrapperWithSideBar>
    );
};

export default TowPage;
