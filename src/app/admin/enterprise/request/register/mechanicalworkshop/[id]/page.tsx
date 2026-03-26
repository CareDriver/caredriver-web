"use client";

import { useRouteId } from "@/hooks/useRouteId";
import ReviewEnterpriseRegistrationRequestWithLoader from "@/components/app_modules/enterprises/views/review_forms/for_registration/ReviewEnterpriseRegistrationRequestWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  const id = useRouteId();
  return (
    <GuardOfRequests>
      <ConsentForm moduleTarget="regmechanicalreq" id={id}>
        <ReviewEnterpriseRegistrationRequestWithLoader
          reqId={id}
          type="mechanical"
        />
      </ConsentForm>
    </GuardOfRequests>
  );
};

export default Page;
