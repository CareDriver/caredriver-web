import EnterpriseUpReqsRender from "@/components/requests/enterprises/edit/EnterpriseUpReqsRender";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const WorkshopUpReqsRenderPage = () => {
    return (
        <AdminWrapperWithSideBar>
            <EnterpriseUpReqsRender type="mechanical" />
        </AdminWrapperWithSideBar>
    );
};

export default WorkshopUpReqsRenderPage;
