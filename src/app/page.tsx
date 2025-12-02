import Home from "@/components/home/Home";
import {
  CareDriverAuthor,
  DEFAULT_ARTICLE_IMAGE,
  DOMAIN,
  NAME_BUSINESS,
} from "@/models/Business";
import { Metadata } from "next";
const pageTitle = `${NAME_BUSINESS} | Envía tu petición para convertirte en Conductor, Mecánico, Operador de Grúa o Lavadero`;
const pageDescription =
  "Descubre cómo nuestro innovador servicio te conecta con choferes capacitados para conducir tu auto en momentos de necesidad, mecánicos expertos listos para solucionar cualquier problema y remolques rápidos para asistirte en situaciones difíciles, y lavaderos que garantizan dejar tu vehículo como nuevo. ¡Conduce seguro y tranquilo en todo momento!";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
  category: "Servicios Automotrices",
  keywords: [
    "servicios automotrices",
    "chofer privado",
    "mecánico a domicilio",
    "asistencia en carretera",
    "servicio de grúa",
    "lavado de autos",
    "registro de proveedores de servicios",
  ],
  openGraph: {
    type: "website",
    url: DOMAIN,
    title: pageTitle,
    description: pageDescription,
    siteName: NAME_BUSINESS,
    images: [
      {
        url: DEFAULT_ARTICLE_IMAGE,
        alt: "Imagen representativa de servicios automotrices en CareDriver",
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
  return <Home />;
};

export default Page;
