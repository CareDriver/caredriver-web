import { Metadata } from "next";
import ReportsView from "@/components/directory/business-panel/views/ReportsView";

export const metadata: Metadata = {
  title: "Reportes — CareDriver",
};

export default function BusinessReportsPage() {
  return <ReportsView />;
}
