import { Metadata } from "next";
import OffersView from "@/components/directory/business-panel/views/OffersView";

export const metadata: Metadata = {
  title: "Ofertas — CareDriver",
};

export default function BusinessOffersPage() {
  return <OffersView />;
}
