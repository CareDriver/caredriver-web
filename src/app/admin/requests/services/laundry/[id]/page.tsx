import FormToSeeInfo from "@/components/permission_handlers/views/consent_forms/FormToSeeInfo";
import PageRequestPermission from "@/components/permission_handlers/views/page/concrets/PageRequestPermission";
import SingleServiceReq from "@/components/requests/services/SingleServiceReq";

const SingleLaundryReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <FormToSeeInfo target="laundryservicereq" id={params.id}>
                <SingleServiceReq reqId={params.id} type="laundry" />
            </FormToSeeInfo>
        </PageRequestPermission>
    );
};

export default SingleLaundryReqPage;
