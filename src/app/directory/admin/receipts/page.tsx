import { Metadata } from "next";
import AdminPaymentReceiptsView from "@/components/directory/admin-panel/views/AdminPaymentReceiptsView";

export const metadata: Metadata = {
  title: "Comprobantes — Admin CareDriver",
};

export default function AdminPaymentReceiptsPage() {
  return <AdminPaymentReceiptsView />;
}
