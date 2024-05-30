import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";
import BrandingReq from "@/components/user/server_user/BrandingReq";

const AddBrandingReqPage = () => {
    return (
        <PageServerUserPermission>
            <BrandingReq />
        </PageServerUserPermission>
    );
};

export default AddBrandingReqPage;
