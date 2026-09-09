import { Metadata } from "next";
import AdminUsersView from "@/components/directory/admin-panel/views/AdminUsersView";

export const metadata: Metadata = {
  title: "Usuarios — Admin CareDriver",
};

export default function AdminUsersPage() {
  return <AdminUsersView />;
}
