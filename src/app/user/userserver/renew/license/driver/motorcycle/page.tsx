import ServiceContainer from "@/components/app_modules/server_users/views/containers/ServiceContainer";
import LicenseRenewalForm from "@/components/app_modules/server_users/views/request_forms/personal_data/LicenseRenewalForm";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import {
    CareDriverAuthor,
    DEFAULT_ARTICLE_IMAGE,
    DOMAIN,
    NAME_BUSINESS,
} from "@/models/Business";
import { routeToRenewLicenseAsUser } from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Renovación de Licencia de Conductor para Motocicleta`;
const pageDescription =
    "Renueva tu licencia para conducir motocicleta de manera sencilla. Asegúrate de cumplir con los requisitos y mantener tu licencia actualizada para conducir con seguridad.";

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    applicationName: NAME_BUSINESS,
    authors: CareDriverAuthor,
    category: "Renovación de Licencias de Conductor",
    keywords: [
        "renovación de licencia de motocicleta",
        "licencia de conductor de motocicleta",
        "renovar licencia de moto",
        "trámite licencia de moto",
        "licencia de motociclista",
    ],
    openGraph: {
        type: "website",
        url: DOMAIN.concat(routeToRenewLicenseAsUser("motorcycle")),
        title: pageTitle,
        description: pageDescription,
        siteName: NAME_BUSINESS,
        images: [
            {
                url: DEFAULT_ARTICLE_IMAGE,
                alt: "Renovación de licencia para conductores de motocicleta en CareDriver",
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
                <LicenseRenewalForm type={"motorcycle"} />
            </ServiceContainer>
        </GuardForServerUsers>
    );
};

export default Page;
