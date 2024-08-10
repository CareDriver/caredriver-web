import FormToSeeInfo from "@/components/permission_handlers/FormToSeeInfo";
import PageRequestPermission from "@/components/permission_handlers/page/concrets/PageRequestPermission";
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
