import EnterpriseUpReqsRender from "@/components/requests/enterprises/edit/EnterpriseUpReqsRender";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const CranesUpReqsRenderPage = () => {
    return (
        <AdminWrapperWithSideBar>
            <EnterpriseUpReqsRender type="laundry" />
        </AdminWrapperWithSideBar>
    );
};

export default CranesUpReqsRenderPage;
