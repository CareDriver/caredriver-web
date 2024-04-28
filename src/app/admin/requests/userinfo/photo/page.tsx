import UpPhotoReqsRenderer from "@/components/requests/userinfo/photos/UpPhotoReqsRenderer";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfPhotosReqToUpdatePage = () => {
    return (
        <AdminWrapperWithSideBar>
            <UpPhotoReqsRenderer />
        </AdminWrapperWithSideBar>
    );
};

export default ListOfPhotosReqToUpdatePage;
