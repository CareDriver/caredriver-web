import PageRequestPermission from "@/components/permission/page/concrets/PageRequestPermission";
import SingleLicenseReq from "@/components/requests/userinfo/licenses/SingleLicenseReq";

const SingleLicenseReqPage = ({ params }: { params: any }) => {
    return (
        <PageRequestPermission>
            <SingleLicenseReq reqId={params.id} />
        </PageRequestPermission>
    );
};

export default SingleLicenseReqPage;
