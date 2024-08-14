import PageServerUserPermission from "@/components/permission_handlers/views/page/concrets/PageServerUserPermission";
import ChangeLocationReq from "@/components/app_modules/logged_user/server_user/ChangeLocationReq";

const UserLocationPage = () => {
    return (
        <PageServerUserPermission>
            <ChangeLocationReq />
        </PageServerUserPermission>
    );
};

export default UserLocationPage;
