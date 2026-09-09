import { Metadata } from "next";
import BusinessRegistrationForm from "@/components/directory/registration/BusinessRegistrationForm";
import RequireAuth from "@/components/directory/registration/RequireAuth";

export const metadata: Metadata = {
  title: "Registrá tu negocio — CareDriver",
};

export default function BusinessRegistrationPage() {
  return (
    <RequireAuth>
      <BusinessRegistrationForm />
    </RequireAuth>
  );
}
