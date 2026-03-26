"use client";

import { useRouteId } from "@/hooks/useRouteId";
import ReviewFormForEditingAnEnterpriseWithLoader from "@/components/app_modules/enterprises/views/review_forms/for_editing/ReviewFormForEditingAnEnterpriseWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  const id = useRouteId();
  return (
    <GuardOfRequests>
      <ConsentForm moduleTarget="editdriverreq" id={id}>
        <ReviewFormForEditingAnEnterpriseWithLoader reqId={id} type="driver" />
      </ConsentForm>
    </GuardOfRequests>
  );
};

export default Page;
