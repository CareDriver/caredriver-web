import EnterprisesPanelForServerUsers from "@/components/app_modules/enterprises/views/control_panels/concrete/EnterprisesPanelForServerUsers";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import {
  CareDriverAuthor,
  DEFAULT_ARTICLE_IMAGE,
  DOMAIN,
  NAME_BUSINESS,
} from "@/models/Business";
import { routeToAllEnterprisesAsUser } from "@/utils/route_builders/as_user/RouteBuilderForEnterpriseAsUser";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Administra Tus Talleres Mecánicos`;
const pageDescription =
  "Gestiona los talleres mecánicos en los que trabajas o administra aquellos de los que eres propietario o usuario de soporte. Solicita el registro de un nuevo taller mecánico contactando al equipo de ${NAME_BUSINESS} para ampliar tu red de servicios y llegar a más clientes.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
  category: "Administración de Talleres Mecánicos",
  keywords: [
    "administración de talleres mecánicos",
    "registro de talleres mecánicos",
    "gestión de servicios mecánicos",
    "solicitud de registro de talleres",
    "registro de taller mecánico",
  ],
  openGraph: {
    type: "website",
    url: DOMAIN.concat(routeToAllEnterprisesAsUser("mechanical")),
    title: pageTitle,
    description: pageDescription,
    siteName: NAME_BUSINESS,
    images: [
      {
        url: DEFAULT_ARTICLE_IMAGE,
        alt: "Administración de talleres mecánicos en CareDriver",
      },
    ],
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    site: "@".concat(NAME_BUSINESS),
    creator: "@".concat(NAME_BUSINESS),
    images: DEFAULT_ARTICLE_IMAGE,
    title: pageTitle,
    description: pageDescription,
  },
};

const Page = () => {
  return (
    <GuardForServerUsers>
      <EnterprisesPanelForServerUsers typeOfEnterprise="mechanical" />
    </GuardForServerUsers>
  );
};

export default Page;
