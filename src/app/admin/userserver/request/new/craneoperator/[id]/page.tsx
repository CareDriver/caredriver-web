import ClientIdPage from "@/components/guards/ClientIdPage";
import ReviewFormToBeServerUserWithLoader from "@/components/app_modules/server_users/views/review_forms/ReviewFormToBeServerUserWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";
import { CareDriverAuthor, NAME_BUSINESS } from "@/models/Business";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Revisar Solicitud de Operador de Grúa`;

export const metadata: Metadata = {
  title: pageTitle,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
};

const Page = () => {
  return (
    <ClientIdPage>
      {(id) => (
    <GuardOfRequests>
      <ConsentForm moduleTarget="mechanicservicereq" id={id}>
        <ReviewFormToBeServerUserWithLoader reqId={id} type="tow" />
      </ConsentForm>
    </GuardOfRequests>
      )}
    </ClientIdPage>
  );
};


export function generateStaticParams() {
  return [{ id: "_" }];
}

export default Page;
