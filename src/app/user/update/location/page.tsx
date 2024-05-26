import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";
import ChangeLocationReq from "@/components/user/server_user/ChangeLocationReq";

const UserLocationPage = () => {
    return (
        <PageServerUserPermission>
            <ChangeLocationReq />
        </PageServerUserPermission>
    );
};

export default UserLocationPage;
