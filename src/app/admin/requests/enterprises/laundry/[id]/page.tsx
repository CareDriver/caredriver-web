import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import SingleEnterpriseReq from "@/components/requests/enterprises/SingleEnterpriseReq";

const SingleLaundryReqRegistrationPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <FormToSeeInfo target="createlaundryreq" id={params.id}>
                <SingleEnterpriseReq reqId={params.id} type="laundry" />
            </FormToSeeInfo>
        </PageRequestPermission>
    );
};

export default SingleLaundryReqRegistrationPage;
