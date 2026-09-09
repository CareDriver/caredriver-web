import { Metadata } from "next";
import AdminRegistrationRequestsView from "@/components/directory/admin-panel/views/AdminRegistrationRequestsView";

export const metadata: Metadata = {
  title: "Solicitudes — Admin CareDriver",
};

export default function AdminRegistrationRequestsPage() {
  return <AdminRegistrationRequestsView />;
}
