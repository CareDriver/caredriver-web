import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";
import AddNewVehicle from "@/components/services/drive/registration/AddNewVehicle";

const AddNewDrivePage = ({ params }: { params: any }) => {
    return (
        <PageServerUserPermission>
            <AddNewVehicle type={params.type} baseUser={null}/>
        </PageServerUserPermission>
    );
};

export default AddNewDrivePage;
