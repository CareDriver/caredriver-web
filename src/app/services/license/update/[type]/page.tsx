import PageServerUserPermission from "@/components/permission/page/concrets/PageServerUserPermission";
import LicenseUpdater from "@/components/services/LicenseUpdater";
import ServiceWrapper from "@/components/services/ServiceWrapper";

const UpdateLicensePage = ({ params }: { params: any }) => {
    return (
        <PageServerUserPermission>
            <ServiceWrapper>
                <LicenseUpdater type={params.type} />
            </ServiceWrapper>
        </PageServerUserPermission>
    );
};

export default UpdateLicensePage;
