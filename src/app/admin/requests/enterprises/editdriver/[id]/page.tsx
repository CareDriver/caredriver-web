import FormToSeeInfo from "@/components/permission_handlers/views/consent_forms/FormToSeeInfo";
import PageRequestPermission from "@/components/permission_handlers/views/page/concrets/PageRequestPermission";
import SingleEnterpiseUpReq from "@/components/requests/enterprises/edit/SingleEnterpiseUpReq";

const SingleTowUpReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <FormToSeeInfo target="editdriverreq" id={params.id}>
                <SingleEnterpiseUpReq reqId={params.id} type="driver" />
            </FormToSeeInfo>
        </PageRequestPermission>
    );
};

export default SingleTowUpReqPage;
