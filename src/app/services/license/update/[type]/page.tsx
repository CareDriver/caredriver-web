import ServiceContainer from "@/components/app_modules/server_users/views/containers/ServiceContainer";
import UpdateLicenseForm from "@/components/app_modules/server_users/views/form_requests/personal_data/UpdateLicenseForm";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";

const UpdateLicensePage = ({ params }: { params: any }) => {
    return (
        <GuardForServerUsers>
            <ServiceContainer>
                <UpdateLicenseForm type={params.type} />
            </ServiceContainer>
        </GuardForServerUsers>
    );
};

export default UpdateLicensePage;
