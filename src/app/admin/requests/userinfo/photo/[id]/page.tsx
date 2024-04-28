import SingleUpPhotoReq from "@/components/requests/userinfo/photos/SingleUpPhotoReq";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleNewProfilePhotoReqPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <SingleUpPhotoReq reqId={params.id} />
        </AdminWrapperWithSideBar>
    );
};

export default SingleNewProfilePhotoReqPage;
