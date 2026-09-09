import { Metadata } from "next";
import AdminSubscriptionsView from "@/components/directory/admin-panel/views/AdminSubscriptionsView";

export const metadata: Metadata = {
  title: "Suscripciones — Admin CareDriver",
};

export default function AdminSubscriptionsPage() {
  return <AdminSubscriptionsView />;
}
