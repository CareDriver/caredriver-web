import EnterprisesPanelForServerUsers from "@/components/app_modules/enterprises/views/control_panels/EnterprisesPanelForServerUsers";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";

const Page = () => {
    return (
        <GuardForServerUsers>
            <EnterprisesPanelForServerUsers typeOfEnterprise="driver" />
        </GuardForServerUsers>
    );
};

export default Page;
