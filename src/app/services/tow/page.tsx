import CraneOperatorPanelRedirector from "@/components/app_modules/server_users/views/control_panels/server_users_panels/as_crane_operator/CraneOperatorPanelRedirector";
import ServiceContainer from "@/components/app_modules/server_users/views/containers/ServiceContainer";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";

const TowPage = () => {
    return (
        <GuardForServerUsers>
            <ServiceContainer>
                <CraneOperatorPanelRedirector />
            </ServiceContainer>
        </GuardForServerUsers>
    );
};

export default TowPage;
