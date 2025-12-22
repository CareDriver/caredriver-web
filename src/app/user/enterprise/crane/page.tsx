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

const pageTitle = `${NAME_BUSINESS} | Administra Tus Empresas Operadoras de Grúa`;
const pageDescription =
  "Gestiona las empresas operadoras de grúa en las que trabajas o administra aquellas de las que eres propietario o usuario de soporte. Solicita el registro de una nueva empresa operadora de grúa contactando a ${NAME_BUSINESS} y amplía tu alcance de servicio.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
  category: "Administración de Empresas Operadoras de Grúa",
  keywords: [
    "administración de empresas de grúa",
    "registro de empresas operadoras de grúa",
    "gestión de servicios de grúa",
    "solicitud de registro de empresa de grúa",
    "servicios de grúa y asistencia en carretera",
  ],
  openGraph: {
    type: "website",
    url: DOMAIN.concat(routeToAllEnterprisesAsUser("tow")),
    title: pageTitle,
    description: pageDescription,
    siteName: NAME_BUSINESS,
    images: [
      {
        url: DEFAULT_ARTICLE_IMAGE,
        alt: "Administración de empresas operadoras de grúa en CareDriver",
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
      <EnterprisesPanelForServerUsers typeOfEnterprise="tow" />
    </GuardForServerUsers>
  );
};

export default Page;
