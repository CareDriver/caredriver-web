import { Metadata } from "next";
import SubscriptionView from "@/components/directory/business-panel/views/SubscriptionView";

export const metadata: Metadata = {
  title: "Suscripción — CareDriver",
};

export default function BusinessSubscriptionPage() {
  return <SubscriptionView />;
}
