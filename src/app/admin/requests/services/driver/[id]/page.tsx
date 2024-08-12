import FormToSeeInfo from "@/components/permission_handlers/views/consent_forms/FormToSeeInfo";
import PageRequestPermission from "@/components/permission_handlers/views/page/concrets/PageRequestPermission";
import SingleServiceReq from "@/components/requests/services/SingleServiceReq";

const SingleDriveReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <FormToSeeInfo target="driveservicereq" id={params.id}>
                <SingleServiceReq reqId={params.id} type="driver" />
            </FormToSeeInfo>
        </PageRequestPermission>
    );
};

export default SingleDriveReqPage;
