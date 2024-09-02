import ServiceContainer from "@/components/app_modules/server_users/views/containers/ServiceContainer";
import MechanicPanelRedirector from "@/components/app_modules/server_users/views/control_panels/server_users_panels/as_mechanic/MechanicPanelRedirector";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";

const Page = () => {
    return (
        <GuardForServerUsers>
            <ServiceContainer>
                <MechanicPanelRedirector />
            </ServiceContainer>
        </GuardForServerUsers>
    );
};

export default Page;
