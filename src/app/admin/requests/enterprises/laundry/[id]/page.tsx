import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import SingleEnterpriseReq from "@/components/requests/enterprises/SingleEnterpriseReq";

const SingleLaundryReqRegistrationPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <SingleEnterpriseReq reqId={params.id} type="laundry" />
        </PageRequestPermission>
    );
};

export default SingleLaundryReqRegistrationPage;
