import NewEnterpriseRequestForm from "@/components/app_modules/enterprises/views/request_forms/NewEnterpriseRequestForm";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import { NAME_BUSINESS } from "@/models/Business";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${NAME_BUSINESS} | Registrar Taller Mecánico`,
  description:
    "Registra tu taller mecánico o empresa de servicios mecánicos en CareDriver. Completa el formulario con los datos de tu empresa y tus documentos.",
};

const Page = () => {
  return (
    <GuardForServerUsers>
      <NewEnterpriseRequestForm type="mechanical" />
    </GuardForServerUsers>
  );
};

export default Page;
