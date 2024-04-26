import SingleLicenseReq from "@/components/requests/userinfo/licenses/SingleLicenseReq";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleLicenseReqPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <SingleLicenseReq reqId={params.id} />
        </AdminWrapperWithSideBar>
    );
};

export default SingleLicenseReqPage;
