import LicenseUpdater from "@/components/services/LicenseUpdater";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";

const UpdateLicensePage = ({ params }: { params: any }) => {
    return (
        <WrapperWithSideBar>
            <LicenseUpdater type={params.type} />
        </WrapperWithSideBar>
    );
};

export default UpdateLicensePage;
