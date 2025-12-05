import Layout from "@/layouts/Layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CareDriver - Panel de Control",
  description: "Plataforma integral de transporte y servicios especializados. Conecta con conductores, mecánicos, grúas y servicios de lavandería de confianza.",
  keywords: "transporte, conductor, mecánico, grúa, lavandería, servicios",
  authors: [{ name: "CareDriver Team" }],
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "CareDriver - Panel de Control",
    description: "Plataforma integral de transporte y servicios especializados.",
    type: "website",
    siteName: "CareDriver",
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
