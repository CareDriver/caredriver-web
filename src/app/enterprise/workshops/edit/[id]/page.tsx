import EnterpriseEditData from "@/components/enterprises/EnterpriseEditData";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";

const MechanicWorkshopEditPage = ({ params }: { params: any }) => {
    return (
        <WrapperWithSideBar>
            <EnterpriseEditData type="mechanical" id={params.id} />
        </WrapperWithSideBar>
    );
};

export default MechanicWorkshopEditPage;
