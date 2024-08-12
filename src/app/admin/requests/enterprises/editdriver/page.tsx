import PageRequestPermission from "@/components/permission_handlers/views/page/concrets/PageRequestPermission";
import EnterpriseUpReqsRender from "@/components/requests/enterprises/edit/EnterpriseUpReqsRender";

const CranesUpReqsRenderPage = () => {
    return (
        <PageRequestPermission>
            <EnterpriseUpReqsRender type="driver" />
        </PageRequestPermission>
    );
};

export default CranesUpReqsRenderPage;
