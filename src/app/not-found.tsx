import NoFound from "@/components/modules/NoFound";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagina no encontrada",
  description: "",
};

const Page = () => {
  return <NoFound />;
};

export default Page;
