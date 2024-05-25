import EnterpriseEditData from "@/components/enterprises/EnterpriseEditData";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";

const EditCrangePage = ({ params }: { params: any }) => {
    return (
        <WrapperWithSideBar>
            <EnterpriseEditData type="laundry" id={params.id} />
        </WrapperWithSideBar>
    );
};

export default EditCrangePage;
