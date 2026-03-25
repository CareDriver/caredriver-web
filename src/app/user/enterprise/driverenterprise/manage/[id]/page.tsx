import EnterprisePanelForUserServer from "@/components/app_modules/enterprises/views/control_panels/concrete/EnterprisePanelForUserServer";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import { PageStateProviderContainer } from "@/context/PageStateContext";
import { CareDriverAuthor, NAME_BUSINESS } from "@/models/Business";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Administra Tu Empresa de Conductores`;
const pageDescription =
  "Gestiona tu empresa de conductores y envía solicitudes de registro de nuevos usuarios servidores para brindar servicios de transporte.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
};

const Page = ({ params }: { params: any }) => {
  return (
    <GuardForServerUsers>
      <PageStateProviderContainer>
        <EnterprisePanelForUserServer id={params.id} />
      </PageStateProviderContainer>
    </GuardForServerUsers>
  );
};

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default Page;
