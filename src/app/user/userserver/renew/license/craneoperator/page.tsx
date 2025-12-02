import ServiceContainer from "@/components/app_modules/server_users/views/containers/ServiceContainer";
import LicenseRenewalForm from "@/components/app_modules/server_users/views/request_forms/personal_data/LicenseRenewalForm";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import { VehicleType } from "@/interfaces/VehicleInterface";
import {
  CareDriverAuthor,
  DEFAULT_ARTICLE_IMAGE,
  DOMAIN,
  NAME_BUSINESS,
} from "@/models/Business";
import { routeToRenewLicenseAsUser } from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Renovación de Licencia para Operador de Grúa`;
const pageDescription =
  "Renueva tu licencia de operador de grúa y mantén los requisitos de licencia al día para operar grúas de manera segura y conforme a la normativa.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
  category: "Renovación de Licencias de Operador de Grúa",
  keywords: [
    "renovación de licencia de grúa",
    "licencia de operador de grúa",
    "renovar licencia de operador de grúa",
    "trámite licencia de grúa",
    "licencia de grúas",
  ],
  openGraph: {
    type: "website",
    url: DOMAIN.concat(routeToRenewLicenseAsUser("tow")),
    title: pageTitle,
    description: pageDescription,
    siteName: NAME_BUSINESS,
    images: [
      {
        url: DEFAULT_ARTICLE_IMAGE,
        alt: "Renovación de licencia para operadores de grúa en CareDriver",
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
        <LicenseRenewalForm type={VehicleType.TOW} />
      </ServiceContainer>
    </GuardForServerUsers>
  );
};

export default Page;
