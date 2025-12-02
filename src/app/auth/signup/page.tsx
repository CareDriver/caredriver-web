import { AuthenticatorProviderContainer } from "@/components/auth/contexts/AuthenticatorContext";
import AuthenticatorContainer from "@/components/auth/views/containers/AuthenticatorContainer";
import SignUpForm from "@/components/auth/views/sign_up/SignUpForm";
import {
  CareDriverAuthor,
  DEFAULT_ARTICLE_IMAGE,
  DOMAIN,
  NAME_BUSINESS,
} from "@/models/Business";
import { routeToSingUp } from "@/utils/route_builders/as_not_logged/RouteBuilderForAuth";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Regístrate como Conductor, Mecánico, Operador de Grúa o Lavadero`;
const pageDescription =
  "Únete a nuestra comunidad de proveedores de servicios automotrices. Regístrate fácilmente con tu correo electrónico, número de teléfono o Google y empieza a ofrecer servicios de chofer, mecánica, grúa o lavado de autos a nuestros usuarios. ¡Forma parte de nuestro equipo y ayuda a quienes necesitan asistencia en carretera!";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
  category: "Registro de Proveedores de Servicios",
  keywords: [
    "registro de servicios automotrices",
    "registro de proveedores",
    "registro como chofer",
    "registro de mecánico",
    "registro con correo",
    "registro con teléfono",
    "registro con Google",
  ],
  openGraph: {
    type: "website",
    url: DOMAIN.concat(routeToSingUp()),
    title: pageTitle,
    description: pageDescription,
    siteName: NAME_BUSINESS,
    images: [
      {
        url: DEFAULT_ARTICLE_IMAGE,
        alt: "Registro de proveedores de servicios en CareDriver",
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
      <AuthenticatorContainer authTitle="Regístrate !">
        <SignUpForm />
      </AuthenticatorContainer>
    </AuthenticatorProviderContainer>
  );
};

export default Page;
