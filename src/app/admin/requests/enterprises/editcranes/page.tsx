import EnterpriseUpReqsRender from "@/components/requests/enterprises/edit/EnterpriseUpReqsRender";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const CranesUpReqsRenderPage = () => {
    return (
        <AdminWrapperWithSideBar>
            <EnterpriseUpReqsRender type="tow" />
        </AdminWrapperWithSideBar>
    );
};

export default CranesUpReqsRenderPage;
