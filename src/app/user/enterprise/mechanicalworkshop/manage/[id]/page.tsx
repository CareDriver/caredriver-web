import ClientIdPage from "@/components/guards/ClientIdPage";
import EnterprisePanelForUserServer from "@/components/app_modules/enterprises/views/control_panels/concrete/EnterprisePanelForUserServer";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import { PageStateProviderContainer } from "@/context/PageStateContext";
import { CareDriverAuthor, NAME_BUSINESS } from "@/models/Business";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Administra Tu Taller Mecánico`;
const pageDescription =
  "Gestiona los datos de tu taller mecánico y envía solicitudes de registro de nuevos usuarios mecánicos para ampliar los servicios de reparación.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
};

const Page = () => {
  return (
    <ClientIdPage>
      {(id) => (
    <GuardForServerUsers>
      <PageStateProviderContainer>
        <EnterprisePanelForUserServer id={id} />
      </PageStateProviderContainer>
    </GuardForServerUsers>
      )}
    </ClientIdPage>
  );
};


export function generateStaticParams() {
  return [{ id: "_" }];
}

export default Page;
