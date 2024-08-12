import FormToSeeInfo from "@/components/permission_handlers/views/consent_forms/FormToSeeInfo";
import PageRequestPermission from "@/components/permission_handlers/views/page/concrets/PageRequestPermission";
import SingleLicenseReq from "@/components/requests/userinfo/licenses/SingleLicenseReq";

const SingleLicenseReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <FormToSeeInfo target="editlicensereq" id={params.id}>
                <SingleLicenseReq reqId={params.id} />
            </FormToSeeInfo>
        </PageRequestPermission>
    );
};

export default SingleLicenseReqPage;
