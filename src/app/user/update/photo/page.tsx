import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";
import ChangePhotoReq from "@/components/user/server_user/ChangePhotoReq";

const UpdateUserPhoto = () => {
    return (
        <PageServerUserPermission>
            <ChangePhotoReq />
        </PageServerUserPermission>
    );
};

export default UpdateUserPhoto;
