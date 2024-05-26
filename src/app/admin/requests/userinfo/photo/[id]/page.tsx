import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import SingleUpPhotoReq from "@/components/requests/userinfo/photos/SingleUpPhotoReq";

const SingleNewProfilePhotoReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <SingleUpPhotoReq reqId={params.id} />
        </PageRequestPermission>
    );
};

export default SingleNewProfilePhotoReqPage;
