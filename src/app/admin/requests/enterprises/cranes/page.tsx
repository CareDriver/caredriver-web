import PageRequestPermission from "@/components/permission_handlers/views/page/concrets/PageRequestPermission";
import EnterpriseReqsRender from "@/components/requests/enterprises/EnterpriseReqsRender";

const ListOfCraneReqToCreate = () => {
    return (
        <PageRequestPermission>
            <EnterpriseReqsRender type="tow" />
        </PageRequestPermission>
    );
};

export default ListOfCraneReqToCreate;
