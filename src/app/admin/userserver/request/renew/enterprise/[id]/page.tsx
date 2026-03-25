import ClientIdPage from "@/components/guards/ClientIdPage";
import ReviewFormToChangeFromEnterpriseToUser from "@/components/app_modules/server_users/views/review_forms/to_change_enterprise/ReviewFormToChangeFromEnterpriseToUser";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  return (
    <ClientIdPage>
      {(id) => (
    <GuardOfRequests>
      <ConsentForm moduleTarget="changeenterprisereq" id={id}>
        <ReviewFormToChangeFromEnterpriseToUser reqId={id} />
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
