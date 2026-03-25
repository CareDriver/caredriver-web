import ClientIdPage from "@/components/guards/ClientIdPage";
import ReviewEnterpriseRegistrationRequestWithLoader from "@/components/app_modules/enterprises/views/review_forms/for_registration/ReviewEnterpriseRegistrationRequestWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  return (
    <ClientIdPage>
      {(id) => (
    <GuardOfRequests>
      <ConsentForm moduleTarget="reglaundryreq" id={id}>
        <ReviewEnterpriseRegistrationRequestWithLoader
          reqId={id}
          type="laundry"
        />
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
