import PageServerUserPermission from "@/components/permission_handlers/views/page/concrets/PageServerUserPermission";
import ChangePhotoReq from "@/components/app_modules/user/server_user/ChangePhotoReq";

const UpdateUserPhoto = () => {
    return (
        <PageServerUserPermission>
            <ChangePhotoReq />
        </PageServerUserPermission>
    );
};

export default UpdateUserPhoto;
