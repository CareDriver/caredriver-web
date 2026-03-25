import ServerServicesHub from "@/components/app_modules/server_users/views/control_panels/ServerServicesHub";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import {
  CareDriverAuthor,
  DEFAULT_ARTICLE_IMAGE,
  DOMAIN,
  NAME_BUSINESS,
} from "@/models/Business";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Panel de Servicios`;
const pageDescription =
  "Selecciona la vertical de servicios que quieres ofrecer dentro de CareDriver y gestiona tus solicitudes.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
  openGraph: {
    type: "website",
    url: DOMAIN.concat("/user/userserver/service"),
    title: pageTitle,
    description: pageDescription,
    siteName: NAME_BUSINESS,
    images: [
      {
        url: DEFAULT_ARTICLE_IMAGE,
        alt: "Panel de servicios de CareDriver",
      },
    ],
    locale: "es_ES",
  },
};

const Page = () => {
  return (
    <GuardForServerUsers>
      <ServerServicesHub />
    </GuardForServerUsers>
  );
};

export default Page;
