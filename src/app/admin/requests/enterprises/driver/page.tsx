import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import EnterpriseReqsRender from "@/components/requests/enterprises/EnterpriseReqsRender";

const ListOfDriversReqToCreate = () => {
    return (
        <PageRequestPermission>
            <EnterpriseReqsRender type="driver" />
        </PageRequestPermission>
    );
};

export default ListOfDriversReqToCreate;
