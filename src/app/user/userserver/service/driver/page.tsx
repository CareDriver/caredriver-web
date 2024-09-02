import ServiceContainer from "@/components/app_modules/server_users/views/containers/ServiceContainer";
import DriverPanelRedirector from "@/components/app_modules/server_users/views/control_panels/server_users_panels/as_driver/DriverPanelRedirector";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";

const Page = () => {
    return (
        <GuardForServerUsers>
            <ServiceContainer>
                <DriverPanelRedirector />
            </ServiceContainer>
        </GuardForServerUsers>
    );
};

export default Page;
