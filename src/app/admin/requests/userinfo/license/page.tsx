import LicenseReqsRenderer from "@/components/requests/userinfo/LicenseReqsRenderer";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const ListOfLicensesReqToUpdatePage = () => {
    return (
        <AdminWrapperWithSideBar>
            <LicenseReqsRenderer />
        </AdminWrapperWithSideBar>
    );
};

export default ListOfLicensesReqToUpdatePage;
