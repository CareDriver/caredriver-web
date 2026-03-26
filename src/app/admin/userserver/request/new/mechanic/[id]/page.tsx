"use client";

import { useParams } from "next/navigation";
import ReviewFormToBeServerUserWithLoader from "@/components/app_modules/server_users/views/review_forms/ReviewFormToBeServerUserWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  const { id } = useParams() as { id: string };
  return (
    <GuardOfRequests>
      <ConsentForm moduleTarget="mechanicservicereq" id={id}>
        <ReviewFormToBeServerUserWithLoader reqId={id} type="mechanical" />
      </ConsentForm>
    </GuardOfRequests>
  );
};

export default Page;
