import FormToSeeInfo from "@/components/permission_handlers/views/consent_forms/FormToSeeInfo";
import PageRequestPermission from "@/components/permission_handlers/views/page/concrets/PageRequestPermission";
import SingleEnterpiseUpReq from "@/components/requests/enterprises/edit/SingleEnterpiseUpReq";

const SingleTowUpReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <FormToSeeInfo target="editlaundryreq" id={params.id}>
                <SingleEnterpiseUpReq reqId={params.id} type="laundry" />
            </FormToSeeInfo>
        </PageRequestPermission>
    );
};

export default SingleTowUpReqPage;
