import Layout from "@/layouts/Layout";
import { Metadata } from "next";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
