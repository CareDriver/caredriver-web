import ServiceContainer from "@/components/app_modules/server_users/views/containers/ServiceContainer";
import LicenseRenewalForm from "@/components/app_modules/server_users/views/request_forms/personal_data/LicenseRenewalForm";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";

const Page = () => {
    return (
        <GuardForServerUsers>
            <ServiceContainer>
                <LicenseRenewalForm type={"tow"} />
            </ServiceContainer>
        </GuardForServerUsers>
    );
};

export default Page;
