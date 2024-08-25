import ServiceContainer from "@/components/app_modules/server_users/views/containers/ServiceContainer";
import LaundererPanelRedirector from "@/components/app_modules/server_users/views/control_panels/server_users_panels/as_launderer/LaundererPanelRedirector";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";

const Page = () => {
    return (
        <GuardForServerUsers>
            <ServiceContainer>
                <LaundererPanelRedirector />
            </ServiceContainer>
        </GuardForServerUsers>
    );
};

export default Page;
