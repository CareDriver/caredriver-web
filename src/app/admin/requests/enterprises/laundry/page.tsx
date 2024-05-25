import EnterpriseReqsRender from "@/components/requests/enterprises/EnterpriseReqsRender";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfCraneReqToCreate = () => {
    return (
        <AdminWrapperWithSideBar>
            <EnterpriseReqsRender type="laundry" />
        </AdminWrapperWithSideBar>
    );
};

export default ListOfCraneReqToCreate;
