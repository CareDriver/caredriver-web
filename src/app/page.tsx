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
  title: "CareDriver - Panel Web",
  description:
    "Plataforma de transporte y servicios especializados para automótivles. Envía tu solicitud para convertirte en Conductor, Mecánico, Operador de Grúa o Lavadero.",
  keywords:
    "transporte, conductor, mecánico, grúa, lavandería, servicios, caredriver, drivercare, servicios, conductor designado",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "CareDriver - Panel Web",
    description:
      "Plataforma de transporte y servicios especializados para automóviles.",
    type: "website",
    siteName: "CareDriver",
    images: "https://i.ibb.co/8wgXZJB/Screenshot-from-2025-12-05-13-22-46.png",
  },
  robots: "index, follow",
};

const Page = () => {
  return <Home />;
};

export default Page;
