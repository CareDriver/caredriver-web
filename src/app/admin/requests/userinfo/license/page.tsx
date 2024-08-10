import PageRequestPermission from "@/components/permission_handlers/page/concrets/PageRequestPermission";
import LicenseReqsRenderer from "@/components/requests/userinfo/licenses/LicenseReqsRenderer";

const ListOfLicensesReqToUpdatePage = () => {
    return (
        <PageRequestPermission>
            <LicenseReqsRenderer />
        </PageRequestPermission>
    );
};

export default ListOfLicensesReqToUpdatePage;
