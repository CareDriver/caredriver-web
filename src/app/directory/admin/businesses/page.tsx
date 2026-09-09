import { Metadata } from "next";
import AdminBusinessesView from "@/components/directory/admin-panel/views/AdminBusinessesView";

export const metadata: Metadata = {
  title: "Negocios — Admin CareDriver",
};

export default function AdminBusinessesPage() {
  return <AdminBusinessesView />;
}
