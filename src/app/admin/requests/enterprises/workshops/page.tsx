import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import EnterpriseReqsRender from "@/components/requests/enterprises/EnterpriseReqsRender";

const ListOfWorkhopReqToCreate = () => {
    return (
        <PageRequestPermission>
            <EnterpriseReqsRender type="mechanical" />
        </PageRequestPermission>
    );
};

export default ListOfWorkhopReqToCreate;
