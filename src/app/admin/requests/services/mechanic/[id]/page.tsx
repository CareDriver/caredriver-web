import FormToSeeInfo from "@/components/permission_handlers/FormToSeeInfo";
import PageRequestPermission from "@/components/permission_handlers/page/concrets/PageRequestPermission";
import SingleServiceReq from "@/components/requests/services/SingleServiceReq";

const SingleMechanicReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <FormToSeeInfo target="mechanicservicereq" id={params.id}>
                <SingleServiceReq reqId={params.id} type="mechanic" />
            </FormToSeeInfo>
        </PageRequestPermission>
    );
};

export default SingleMechanicReqPage;
