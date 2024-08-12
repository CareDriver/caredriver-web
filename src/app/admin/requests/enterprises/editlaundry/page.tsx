import PageRequestPermission from "@/components/permission_handlers/views/page/concrets/PageRequestPermission";
import EnterpriseUpReqsRender from "@/components/requests/enterprises/edit/EnterpriseUpReqsRender";

const CranesUpReqsRenderPage = () => {
    return (
        <PageRequestPermission>
            <EnterpriseUpReqsRender type="laundry" />
        </PageRequestPermission>
    );
};

export default CranesUpReqsRenderPage;
