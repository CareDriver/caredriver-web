import PageRequestPermission from "@/components/permission_handlers/page/concrets/PageRequestPermission";
import EnterpriseReqsRender from "@/components/requests/enterprises/EnterpriseReqsRender";

const ListOfLaundryReqToCreate = () => {
    return (
        <PageRequestPermission>
            <EnterpriseReqsRender type="laundry" />
        </PageRequestPermission>
    );
};

export default ListOfLaundryReqToCreate;
