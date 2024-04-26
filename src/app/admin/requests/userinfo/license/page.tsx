import LicenseReqsRenderer from "@/components/requests/userinfo/licenses/LicenseReqsRenderer";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfLicensesReqToUpdatePage = () => {
    return (
        <AdminWrapperWithSideBar>
            <LicenseReqsRenderer />
        </AdminWrapperWithSideBar>
    );
};

export default ListOfLicensesReqToUpdatePage;
