import LaundryService from "@/components/services/laundry/LaundryService";
import ServiceWrapper from "@/components/services/ServiceWrapper";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";

const MechanicPage = () => {
    return (
        <WrapperWithSideBar>
            <ServiceWrapper>
                <LaundryService />
            </ServiceWrapper>
        </WrapperWithSideBar>
    );
};

export default MechanicPage;
