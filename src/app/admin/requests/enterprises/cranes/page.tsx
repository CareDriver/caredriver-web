import EnterpriseReqsRender from "@/components/requests/enterprises/EnterpriseReqsRender";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfCraneReqToCreate = () => {
    return (
        <AdminWrapperWithSideBar>
            <EnterpriseReqsRender type="tow" />
        </AdminWrapperWithSideBar>
    );
};

export default ListOfCraneReqToCreate;
