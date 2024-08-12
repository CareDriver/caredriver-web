import PageServerUserPermission from "@/components/permission_handlers/views/page/concrets/PageServerUserPermission";
import BrandingReq from "@/components/app_modules/user/server_user/BrandingReq";

const AddBrandingReqPage = () => {
    return (
        <PageServerUserPermission>
            <BrandingReq />
        </PageServerUserPermission>
    );
};

export default AddBrandingReqPage;
