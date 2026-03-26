"use client";

import { useParams } from "next/navigation";
import ReviewEnterpriseRegistrationRequestWithLoader from "@/components/app_modules/enterprises/views/review_forms/for_registration/ReviewEnterpriseRegistrationRequestWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  const { id } = useParams() as { id: string };
  return (
    <GuardOfRequests>
      <ConsentForm moduleTarget="reglaundryreq" id={id}>
        <ReviewEnterpriseRegistrationRequestWithLoader
          reqId={id}
          type="laundry"
        />
      </ConsentForm>
    </GuardOfRequests>
  );
};

export default Page;
