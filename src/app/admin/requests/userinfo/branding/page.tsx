import PageRequestPermission from "@/components/permission_handlers/page/concrets/PageRequestPermission";
import BrandingReqsRenderer from "@/components/requests/userinfo/branding/BrandingReqsRenderer";

const ListOfBrandingCheckPage = () => {
    return (
        <PageRequestPermission>
            <BrandingReqsRenderer />
        </PageRequestPermission>
    );
};

export default ListOfBrandingCheckPage;
