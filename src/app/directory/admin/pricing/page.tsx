import { Metadata } from "next";
import AdminPricingCampaignsView from "@/components/directory/admin-panel/views/AdminPricingCampaignsView";

export const metadata: Metadata = {
  title: "Precios y descuentos — Admin CareDriver",
};

export default function AdminPricingPage() {
  return <AdminPricingCampaignsView />;
}
