"use client";

import { useRouteId } from "@/hooks/useRouteId";
import ReviewFormToBeServerUserWithLoader from "@/components/app_modules/server_users/views/review_forms/ReviewFormToBeServerUserWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  const id = useRouteId();
  return (
    <GuardOfRequests>
      <ConsentForm moduleTarget="laundryservicereq" id={id}>
        <ReviewFormToBeServerUserWithLoader reqId={id} type="laundry" />
      </ConsentForm>
    </GuardOfRequests>
  );
};

export default Page;
