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

const pageTitle = `${NAME_BUSINESS} | Administra Tus Empresas de Lavaderos`;
const pageDescription =
  "Gestiona las empresas de lavaderos en las que trabajas o administra aquellas de las que eres propietario o usuario de soporte. Solicita el registro de una nueva empresa de lavaderos contactando al equipo de ${NAME_BUSINESS} para expandir y mejorar tus servicios de lavado de vehículos.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
  category: "Administración de Empresas de Lavaderos",
  keywords: [
    "administración de lavaderos",
    "registro de empresas de lavaderos",
    "gestión de servicios de lavado de vehículos",
    "solicitud de registro de lavaderos",
    "registro de empresa de lavado de autos",
  ],
  openGraph: {
    type: "website",
    url: DOMAIN.concat(routeToAllEnterprisesAsUser("laundry")),
    title: pageTitle,
    description: pageDescription,
    siteName: NAME_BUSINESS,
    images: [
      {
        url: DEFAULT_ARTICLE_IMAGE,
        alt: "Administración de empresas de lavaderos en CareDriver",
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
      <EnterprisesPanelForServerUsers typeOfEnterprise="laundry" />
    </GuardForServerUsers>
  );
};

export default Page;
