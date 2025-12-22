import ServiceContainer from "@/components/app_modules/server_users/views/containers/ServiceContainer";
import DriverPanelRedirector from "@/components/app_modules/server_users/views/control_panels/server_users_panels/as_driver/DriverPanelRedirector";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import {
  CareDriverAuthor,
  DEFAULT_ARTICLE_IMAGE,
  DOMAIN,
  NAME_BUSINESS,
} from "@/models/Business";
import { routeToRequestToBeServerUserAsUser } from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Selecciona una Empresa de Radio Taxis o Conductores`;
const pageDescription =
  "Explora nuestra lista de empresas de radio taxis y servicios de conductores. Selecciona una empresa para ver su información de contacto y realizar una solicitud de registro como conductor profesional. ¡Conéctate con el servicio adecuado y empieza a ofrecer tus habilidades de conducción!";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
  category: "Registro de Conductores",
  keywords: [
    "registro de conductores",
    "servicio de radio taxis",
    "empresas de conductores",
    "registro de choferes",
    "solicitud de trabajo como conductor",
  ],
  openGraph: {
    type: "website",
    url: DOMAIN.concat(routeToRequestToBeServerUserAsUser("driver")),
    title: pageTitle,
    description: pageDescription,
    siteName: NAME_BUSINESS,
    images: [
      {
        url: DEFAULT_ARTICLE_IMAGE,
        alt: "Lista de empresas de radio taxis y servicios de conductores en CareDriver",
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
      <ServiceContainer>
        <DriverPanelRedirector />
      </ServiceContainer>
    </GuardForServerUsers>
  );
};

export default Page;
