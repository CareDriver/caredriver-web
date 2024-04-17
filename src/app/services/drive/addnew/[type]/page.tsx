import AddNewVehicle from "@/components/services/drive/registration/AddNewVehicle";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";

const AddNewDrivePage = ({ params }: { params: any }) => {
    return (
        <WrapperWithSideBar>
            <AddNewVehicle type={params.type} />
        </WrapperWithSideBar>
    );
};

export default AddNewDrivePage;
