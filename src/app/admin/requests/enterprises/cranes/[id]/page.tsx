import SingleEnterpriseReq from "@/components/requests/enterprises/SingleEnterpriseReq";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleCraneReqRegistrationPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <SingleEnterpriseReq reqId={params.id} type="tow" />
        </AdminWrapperWithSideBar>
    );
};

export default SingleCraneReqRegistrationPage;
