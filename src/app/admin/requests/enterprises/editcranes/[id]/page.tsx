import FormToSeeInfo from "@/components/permission_handlers/FormToSeeInfo";
import PageRequestPermission from "@/components/permission_handlers/page/concrets/PageRequestPermission";
import SingleEnterpiseUpReq from "@/components/requests/enterprises/edit/SingleEnterpiseUpReq";

const SingleTowUpReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <FormToSeeInfo target="editcranereq" id={params.id}>
                <SingleEnterpiseUpReq reqId={params.id} type="tow" />
            </FormToSeeInfo>
        </PageRequestPermission>
    );
};

export default SingleTowUpReqPage;
