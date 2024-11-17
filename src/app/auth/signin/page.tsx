import { AuthenticatorProviderContainer } from "@/components/auth/contexts/AuthenticatorContext";
import AuthenticatorContainer from "@/components/auth/views/containers/AuthenticatorContainer";
import SignInForm from "@/components/auth/views/sign_in/SignInForm";
import {
    CareDriverAuthor,
    DEFAULT_ARTICLE_IMAGE,
    DOMAIN,
    NAME_BUSINESS,
} from "@/models/Business";
import { routeToSingIn } from "@/utils/route_builders/as_not_logged/RouteBuilderForAuth";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Inicia Sesión como Conductor, Mecánico, Operador de Grúa o Lavadero`;
const pageDescription =
    "Accede a tu cuenta en nuestra plataforma de servicios automotrices. Inicia sesión rápidamente usando tu correo electrónico, número de teléfono o cuenta de Google y sigue brindando asistencia como chofer, mecánico, operador de grúa o lavadero. ¡Mantente conectado y disponible para quienes necesitan tus servicios!";

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    applicationName: NAME_BUSINESS,
    authors: CareDriverAuthor,
    category: "Inicio de Sesión de Proveedores de Servicios",
    keywords: [
        "inicio de sesión de servicios automotrices",
        "acceso de proveedores",
        "iniciar sesión como chofer",
        "iniciar sesión como mecánico",
        "login con correo",
        "login con teléfono",
        "login con Google",
    ],
    openGraph: {
        type: "website",
        url: DOMAIN.concat(routeToSingIn()),
        title: pageTitle,
        description: pageDescription,
        siteName: NAME_BUSINESS,
        images: [
            {
                url: DEFAULT_ARTICLE_IMAGE,
                alt: "Inicio de sesión de proveedores de servicios en CareDriver",
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
        <AuthenticatorProviderContainer>
            <AuthenticatorContainer authTitle="Inicia sesión">
                <SignInForm />
            </AuthenticatorContainer>
        </AuthenticatorProviderContainer>
    );
};

export default Page;
