import { Metadata } from "next";
import AdminDashboardView from "@/components/directory/admin-panel/views/AdminDashboardView";

export const metadata: Metadata = {
  title: "Admin — CareDriver",
};

export default function AdminDashboardPage() {
  return <AdminDashboardView />;
}
