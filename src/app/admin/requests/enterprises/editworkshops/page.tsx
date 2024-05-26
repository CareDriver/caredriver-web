import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import EnterpriseUpReqsRender from "@/components/requests/enterprises/edit/EnterpriseUpReqsRender";

const WorkshopUpReqsRenderPage = () => {
    return (
        <PageRequestPermission>
            <EnterpriseUpReqsRender type="mechanical" />
        </PageRequestPermission>
    );
};

export default WorkshopUpReqsRenderPage;
