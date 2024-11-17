import CraneOperatorPanelRedirector from "@/components/app_modules/server_users/views/control_panels/server_users_panels/as_crane_operator/CraneOperatorPanelRedirector";
import ServiceContainer from "@/components/app_modules/server_users/views/containers/ServiceContainer";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import {
    CareDriverAuthor,
    DEFAULT_ARTICLE_IMAGE,
    DOMAIN,
    NAME_BUSINESS,
} from "@/models/Business";
import { Metadata } from "next";
import { routeToRequestToBeServerUserAsUser } from "@/utils/route_builders/as_user/RouteBuilderForUserServerAsUser";

const pageTitle = `${NAME_BUSINESS} | Regístrate como Operador de Grúa en Nuestra Plataforma`;
const pageDescription =
    "Regístrate como operador de grúa en nuestra plataforma y ayuda a usuarios en situaciones de emergencia vial. Completa tus datos, indica tu licencia para operar grúas y selecciona la empresa de grúas a la que perteneces para empezar a recibir solicitudes. ¡Ofrece tu asistencia con seguridad y profesionalismo!";

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    applicationName: NAME_BUSINESS,
    authors: CareDriverAuthor,
    category: "Registro de Operadores de Grúa",
    keywords: [
        "registro de operadores de grúa",
        "operadores de grúa en línea",
        "servicio de grúas de emergencia",
        "licencia para operar grúa",
        "registro de conductores de grúa",
    ],
    openGraph: {
        type: "website",
        url: DOMAIN.concat(routeToRequestToBeServerUserAsUser("tow")),
        title: pageTitle,
        description: pageDescription,
        siteName: NAME_BUSINESS,
        images: [
            {
                url: DEFAULT_ARTICLE_IMAGE,
                alt: "Formulario de registro de operadores de grúa en CareDriver",
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
                <CraneOperatorPanelRedirector />
            </ServiceContainer>
        </GuardForServerUsers>
    );
};

export default Page;
