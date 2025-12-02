import UserProfileForServerUser from "@/components/app_modules/users/views/control_panels/UserProfileForServerUser";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import { CareDriverAuthor, NAME_BUSINESS } from "@/models/Business";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Perfil de Usuario`;
const pageDescription =
  "Consulta tu perfil, revisa tu saldo disponible y comunícate con los administradores para recargar saldo.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
};

const Page = () => {
  return (
    <GuardForServerUsers>
      <UserProfileForServerUser />
    </GuardForServerUsers>
  );
};

export default Page;
