import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import SingleEnterpriseReq from "@/components/requests/enterprises/SingleEnterpriseReq";

const SingleWorlshopReqRegistrationPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <SingleEnterpriseReq reqId={params.id} type="mechanical" />
        </PageRequestPermission>
    );
};

export default SingleWorlshopReqRegistrationPage;
