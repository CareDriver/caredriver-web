import { Metadata } from "next";
import ContactsView from "@/components/directory/business-panel/views/ContactsView";

export const metadata: Metadata = {
  title: "Contactos — CareDriver",
};

export default function BusinessContactsPage() {
  return <ContactsView />;
}
