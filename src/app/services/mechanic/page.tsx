import MechanicService from "@/components/services/mechanic/MechanicService";
import ServiceWrapper from "@/components/services/ServiceWrapper";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";

const MechanicPage = () => {
    return (
        <WrapperWithSideBar>
            <ServiceWrapper>
                <MechanicService />
            </ServiceWrapper>
        </WrapperWithSideBar>
    );
};

export default MechanicPage;
