import PageRequestPermission from "@/components/permission_handlers/views/page/concrets/PageRequestPermission";
import EnterpriseReqsRender from "@/components/requests/enterprises/EnterpriseReqsRender";

const ListOfWorkhopReqToCreate = () => {
    return (
        <PageRequestPermission>
            <EnterpriseReqsRender type="mechanical" />
        </PageRequestPermission>
    );
};

export default ListOfWorkhopReqToCreate;
