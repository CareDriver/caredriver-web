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

const pageTitle = `${NAME_BUSINESS} | Renovación de Licencia de Conductor para Auto`;
const pageDescription =
  "Renueva tu licencia de conductor de auto de manera fácil y rápida. Completa los pasos en línea para mantener tu licencia actualizada y cumplir con los requisitos legales.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
  category: "Renovación de Licencias de Conductor",
  keywords: [
    "renovación de licencia de conductor",
    "licencia de auto",
    "renovar licencia de auto",
    "trámite licencia de conductor",
    "licencia de manejo",
  ],
  openGraph: {
    type: "website",
    url: DOMAIN.concat(routeToRenewLicenseAsUser("car")),
    title: pageTitle,
    description: pageDescription,
    siteName: NAME_BUSINESS,
    images: [
      {
        url: DEFAULT_ARTICLE_IMAGE,
        alt: "Renovación de licencia para conductores de auto en CareDriver",
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
        <LicenseRenewalForm type={VehicleType.CAR} />
      </ServiceContainer>
    </GuardForServerUsers>
  );
};

export default Page;
