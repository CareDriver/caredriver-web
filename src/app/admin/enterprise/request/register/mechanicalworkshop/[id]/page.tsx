import ReviewEnterpriseRegistrationRequestWithLoader from "@/components/app_modules/enterprises/views/review_forms/for_registration/ReviewEnterpriseRegistrationRequestWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = ({ params }: { params: any }) => {
  return (
    <GuardOfRequests>
      <ConsentForm moduleTarget="regmechanicalreq" id={params.id}>
        <ReviewEnterpriseRegistrationRequestWithLoader
          reqId={params.id}
          type="mechanical"
        />
      </ConsentForm>
    </GuardOfRequests>
  );
};

export default Page;
