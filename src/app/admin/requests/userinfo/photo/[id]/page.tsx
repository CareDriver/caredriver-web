import FormToSeeInfo from "@/components/permission/FormToSeeInfo";
import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import SingleUpPhotoReq from "@/components/requests/userinfo/photos/SingleUpPhotoReq";

const SingleNewProfilePhotoReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <FormToSeeInfo target="editprofilephotoreq" id={params.id}>
                <SingleUpPhotoReq reqId={params.id} />
            </FormToSeeInfo>
        </PageRequestPermission>
    );
};

export default SingleNewProfilePhotoReqPage;
