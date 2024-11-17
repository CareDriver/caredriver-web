import EnterprisePanelForUserServer from "@/components/app_modules/enterprises/views/control_panels/concrete/EnterprisePanelForUserServer";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import { PageStateProviderContainer } from "@/context/PageStateContext";
import { CareDriverAuthor, NAME_BUSINESS } from "@/models/Business";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Administra Tu Empresa de Lavado de Vehículos`;
const pageDescription =
    "Gestiona los datos de tu lavadero y envía solicitudes de registro de nuevos usuarios lavadores para ampliar los servicios de lavado.";

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
