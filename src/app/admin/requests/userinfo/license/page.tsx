import PageRequestPermission from "@/components/permission_handlers/views/page/concrets/PageRequestPermission";
import LicenseReqsRenderer from "@/components/requests/userinfo/licenses/LicenseReqsRenderer";

const ListOfLicensesReqToUpdatePage = () => {
    return (
        <PageRequestPermission>
            <LicenseReqsRenderer />
        </PageRequestPermission>
    );
};

export default ListOfLicensesReqToUpdatePage;
