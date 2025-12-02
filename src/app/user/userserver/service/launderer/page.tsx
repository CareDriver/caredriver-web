import ServiceContainer from "@/components/app_modules/server_users/views/containers/ServiceContainer";
import LaundererPanelRedirector from "@/components/app_modules/server_users/views/control_panels/server_users_panels/as_launderer/LaundererPanelRedirector";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import {
  CareDriverAuthor,
  DEFAULT_ARTICLE_IMAGE,
  DOMAIN,
  NAME_BUSINESS,
} from "@/models/Business";
import { routeToRequestToBeServerUserAsUser } from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Regístrate como Lavador de Autos en Nuestra Plataforma`;
const pageDescription =
  "Únete como lavador de autos en nuestra plataforma y brinda tus servicios a clientes en busca de calidad y confiabilidad. Completa el formulario con tus datos y selecciona el lavadero al que perteneces para comenzar a recibir solicitudes. ¡Haz que cada vehículo luzca como nuevo!";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
  category: "Registro de Lavadores de Autos",
  keywords: [
    "registro de lavadores de autos",
    "plataforma de lavaderos de autos",
    "servicio de lavado de autos en línea",
    "lavadero de autos",
    "formulario de lavador de autos",
  ],
  openGraph: {
    type: "website",
    url: DOMAIN.concat(routeToRequestToBeServerUserAsUser("laundry")),
    title: pageTitle,
    description: pageDescription,
    siteName: NAME_BUSINESS,
    images: [
      {
        url: DEFAULT_ARTICLE_IMAGE,
        alt: "Formulario de registro de lavadores de autos en CareDriver",
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
        <LaundererPanelRedirector />
      </ServiceContainer>
    </GuardForServerUsers>
  );
};

export default Page;
