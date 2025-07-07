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

const pageTitle = `${NAME_BUSINESS} | Administra Tus Empresas de Conductores y Radio Taxis`;
const pageDescription =
  "Administra las empresas de conductores y servicios de radio taxis de las que eres propietario o usuario de soporte. Solicita el registro de una nueva empresa contactando al equipo de administración de ${NAME_BUSINESS}. Facilita la gestión y expansión de tu red de transporte.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
  category: "Administración de Empresas de Transporte",
  keywords: [
    "administración de empresas de conductores",
    "registro de empresas de radio taxis",
    "gestión de servicios de transporte",
    "solicitud de registro de empresa",
    "registro de empresa de conductores",
  ],
  openGraph: {
    type: "website",
    url: DOMAIN.concat(routeToAllEnterprisesAsUser("driver")),
    title: pageTitle,
    description: pageDescription,
    siteName: NAME_BUSINESS,
    images: [
      {
        url: DEFAULT_ARTICLE_IMAGE,
        alt: "Administración de empresas de conductores y radio taxis en CareDriver",
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
      <EnterprisesPanelForServerUsers typeOfEnterprise="driver" />
    </GuardForServerUsers>
  );
};

export default Page;
