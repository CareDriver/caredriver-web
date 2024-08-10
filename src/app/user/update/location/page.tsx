import PageServerUserPermission from "@/components/permission_handlers/page/concrets/PageServerUserPermission";
import ChangeLocationReq from "@/components/app_modules/user/server_user/ChangeLocationReq";

const UserLocationPage = () => {
    return (
        <PageServerUserPermission>
            <ChangeLocationReq />
        </PageServerUserPermission>
    );
};

export default UserLocationPage;
