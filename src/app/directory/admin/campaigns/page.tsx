import { Metadata } from "next";
import AdminSeasonalCampaignsView from "@/components/directory/admin-panel/views/AdminSeasonalCampaignsView";

export const metadata: Metadata = {
  title: "Campañas estacionales — Admin CareDriver",
};

export default function AdminSeasonalCampaignsPage() {
  return <AdminSeasonalCampaignsView />;
}
