import EnterprisePanelForAdmin from "@/components/app_modules/enterprises/views/control_panels/concrete/EnterprisePanelForAdmin";
import GuardOfEnterprises from "@/components/guards/views/page_guards/concrets/GuardOfEnterprises";
import { PageStateProviderContainer } from "@/context/PageStateContext";

const Page = ({ params }: { params: any }) => {
    return (
        <GuardOfEnterprises>
            <PageStateProviderContainer>
                <EnterprisePanelForAdmin id={params.id} />;
            </PageStateProviderContainer>
        </GuardOfEnterprises>
    );
};

export default Page;
