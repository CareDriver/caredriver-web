import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import SingleEnterpriseReq from "@/components/requests/enterprises/SingleEnterpriseReq";

const SingleCraneReqRegistrationPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <SingleEnterpriseReq reqId={params.id} type="tow" />
        </PageRequestPermission>
    );
};

export default SingleCraneReqRegistrationPage;
