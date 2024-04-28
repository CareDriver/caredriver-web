import EnterpriseReqsRender from "@/components/requests/enterprises/EnterpriseReqsRender";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfWorkhopReqToCreate = () => {
    return (
        <AdminWrapperWithSideBar>
            <EnterpriseReqsRender type="mechanical" />
        </AdminWrapperWithSideBar>
    );
};

export default ListOfWorkhopReqToCreate;
