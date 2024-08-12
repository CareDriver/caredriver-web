import FormToSeeInfo from "@/components/permission_handlers/views/consent_forms/FormToSeeInfo";
import PageRequestPermission from "@/components/permission_handlers/views/page/concrets/PageRequestPermission";
import SingleBrandingReq from "@/components/requests/userinfo/branding/SingleBrandingReq";

const SingleNewProfilePhotoReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <FormToSeeInfo target="checkvalidbrandingreq" id={params.id}>
                <SingleBrandingReq reqId={params.id} />
            </FormToSeeInfo>
        </PageRequestPermission>
    );
};

export default SingleNewProfilePhotoReqPage;
