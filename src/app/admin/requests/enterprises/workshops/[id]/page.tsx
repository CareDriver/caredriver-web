import FormToSeeInfo from "@/components/permission_handlers/views/consent_forms/FormToSeeInfo";
import PageRequestPermission from "@/components/permission_handlers/views/page/concrets/PageRequestPermission";
import SingleEnterpriseReq from "@/components/requests/enterprises/SingleEnterpriseReq";

const SingleWorlshopReqRegistrationPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <FormToSeeInfo target="createworkshopreq" id={params.id}>
                <SingleEnterpriseReq reqId={params.id} type="mechanical" />
            </FormToSeeInfo>
        </PageRequestPermission>
    );
};

export default SingleWorlshopReqRegistrationPage;
