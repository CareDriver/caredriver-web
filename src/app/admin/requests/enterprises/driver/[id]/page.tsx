import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import SingleEnterpriseReq from "@/components/requests/enterprises/SingleEnterpriseReq";

const SingleDriverReqRegistrationPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <FormToSeeInfo target="createdriverreq" id={params.id}>
                <SingleEnterpriseReq reqId={params.id} type="driver" />
            </FormToSeeInfo>
        </PageRequestPermission>
    );
};

export default SingleDriverReqRegistrationPage;
