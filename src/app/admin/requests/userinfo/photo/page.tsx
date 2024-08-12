import PageRequestPermission from "@/components/permission_handlers/views/page/concrets/PageRequestPermission";
import UpPhotoReqsRenderer from "@/components/requests/userinfo/photos/UpPhotoReqsRenderer";

const ListOfPhotosReqToUpdatePage = () => {
    return (
        <PageRequestPermission>
            <UpPhotoReqsRenderer />
        </PageRequestPermission>
    );
};

export default ListOfPhotosReqToUpdatePage;
