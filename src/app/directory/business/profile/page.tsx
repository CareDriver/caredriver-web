import { Metadata } from "next";
import ProfileView from "@/components/directory/business-panel/views/ProfileView";

export const metadata: Metadata = {
  title: "Ficha — CareDriver",
};

export default function BusinessProfilePage() {
  return <ProfileView />;
}
