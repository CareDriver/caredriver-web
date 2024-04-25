import SingleEnterpriseReq from "@/components/requests/enterprises/SingleEnterpriseReq";
import AdminWrapperWithSideBar from "@/layouts/AdminWrapperWithSideBar";

const SingleWorlshopReqRegistrationPage = ({ params }: { params: any }) => {
    return (
        <AdminWrapperWithSideBar>
            <SingleEnterpriseReq reqId={params.id} type="mechanical" />
        </AdminWrapperWithSideBar>
    );
};

export default SingleWorlshopReqRegistrationPage;
