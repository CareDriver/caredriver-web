import EnterprisePanelForUserServer from "@/components/app_modules/enterprises/views/control_panels/EnterprisePanelForUserServer";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import { PageStateProviderContainer } from "@/context/PageStateContext";

const Page = ({ params }: { params: any }) => {
    return (
        <GuardForServerUsers>
            <PageStateProviderContainer>
                <EnterprisePanelForUserServer id={params.id} />
            </PageStateProviderContainer>
        </GuardForServerUsers>
    );
};

export default Page;
