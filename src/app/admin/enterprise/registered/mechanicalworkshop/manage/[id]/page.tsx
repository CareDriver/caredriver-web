import ClientIdPage from "@/components/guards/ClientIdPage";
import EnterprisePanelForAdmin from "@/components/app_modules/enterprises/views/control_panels/concrete/EnterprisePanelForAdmin";
import GuardOfEnterprises from "@/components/guards/views/page_guards/concrets/GuardOfEnterprises";
import { PageStateProviderContainer } from "@/context/PageStateContext";

const Page = () => {
  return (
    <ClientIdPage>
      {(id) => (
    <GuardOfEnterprises>
      <PageStateProviderContainer>
        <EnterprisePanelForAdmin id={id} />;
      </PageStateProviderContainer>
    </GuardOfEnterprises>
      )}
    </ClientIdPage>
  );
};


export function generateStaticParams() {
  return [{ id: "_" }];
}

export default Page;
