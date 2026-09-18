import { Metadata } from "next";
import BusinessRegistrationForm from "@/components/directory/registration/BusinessRegistrationForm";
import RequireAuth from "@/components/directory/registration/RequireAuth";

export const metadata: Metadata = {
  title: "Registra tu negocio — CareDriver",
};

export default function BusinessRegistrationPage() {
  return (
    <RequireAuth>
      <BusinessRegistrationForm />
    </RequireAuth>
  );
}
