import NewEnterpriseRequestForm from "@/components/app_modules/enterprises/views/request_forms/NewEnterpriseRequestForm";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import { NAME_BUSINESS } from "@/models/Business";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${NAME_BUSINESS} | Registrar Empresa de Conductores`,
  description:
    "Registra tu empresa de conductores o radio taxi en CareDriver. Completa el formulario con los datos de tu empresa y tus documentos.",
};

const Page = () => {
  return (
    <GuardForServerUsers>
      <NewEnterpriseRequestForm type="driver" />
    </GuardForServerUsers>
  );
};

export default Page;
