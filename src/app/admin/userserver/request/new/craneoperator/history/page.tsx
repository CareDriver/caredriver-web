import ListOfRequestsHistoryServerUser from "@/components/app_modules/server_users/views/list_of_cards/ListOfRequestsHistoryServerUser";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";
import { CareDriverAuthor, NAME_BUSINESS } from "@/models/Business";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Historial de Solicitudes — Operador de Grúa`;

export const metadata: Metadata = {
  title: pageTitle,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
};

const Page = () => {
  return (
    <GuardOfRequests>
      <ListOfRequestsHistoryServerUser type="tow" />
    </GuardOfRequests>
  );
};

export default Page;
