import { Metadata } from "next";
import DashboardView from "@/components/directory/business-panel/views/DashboardView";

export const metadata: Metadata = {
  title: "Panel del Negocio — CareDriver",
};

export default function BusinessDashboardPage() {
  return <DashboardView />;
}
