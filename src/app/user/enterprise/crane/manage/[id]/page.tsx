import EnterprisePanelForUserServer from "@/components/app_modules/enterprises/views/control_panels/concrete/EnterprisePanelForUserServer";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import { PageStateProviderContainer } from "@/context/PageStateContext";
import { CareDriverAuthor, NAME_BUSINESS } from "@/models/Business";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Administra Tu Empresa Operadora de Grúa`;
const pageDescription =
  "Gestiona la información de tu empresa operadora de grúa y envía solicitudes para registrar nuevos operadores de grúa y mejorar la asistencia en carretera.";

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

export default Page;
