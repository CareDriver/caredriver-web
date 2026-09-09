import { Metadata } from "next";
import AdminReferralsView from "@/components/directory/admin-panel/views/AdminReferralsView";

export const metadata: Metadata = {
  title: "Referidos — Admin CareDriver",
};

export default function AdminReferralsPage() {
  return <AdminReferralsView />;
}
