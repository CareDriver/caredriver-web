import ServiceContainer from "@/components/app_modules/server_users/views/containers/ServiceContainer";
import MechanicPanelRedirector from "@/components/app_modules/server_users/views/control_panels/server_users_panels/as_mechanic/MechanicPanelRedirector";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import {
  CareDriverAuthor,
  DEFAULT_ARTICLE_IMAGE,
  DOMAIN,
  NAME_BUSINESS,
} from "@/models/Business";
import { routeToRequestToBeServerUserAsUser } from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Regístrate como Mecánico en Nuestra Plataforma de Servicios`;
const pageDescription =
  "Únete como mecánico en nuestra plataforma y ofrece tus servicios a clientes en busca de asistencia automotriz confiable. Completa el formulario con tus datos, indica las herramientas que usas y, si aplicable, el taller al que perteneces. ¡Conviértete en parte de nuestra red de expertos automotrices!";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
  category: "Registro de Mecánicos",
  keywords: [
    "registro de mecánicos",
    "plataforma de mecánicos automotrices",
    "servicio de mecánica en línea",
    "herramientas de mecánico",
    "talleres mecánicos",
    "formulario de mecánico",
  ],
  openGraph: {
    type: "website",
    url: DOMAIN.concat(routeToRequestToBeServerUserAsUser("mechanical")),
    title: pageTitle,
    description: pageDescription,
    siteName: NAME_BUSINESS,
    images: [
      {
        url: DEFAULT_ARTICLE_IMAGE,
        alt: "Formulario de registro de mecánicos en CareDriver",
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
        <MechanicPanelRedirector />
      </ServiceContainer>
    </GuardForServerUsers>
  );
};

export default Page;
