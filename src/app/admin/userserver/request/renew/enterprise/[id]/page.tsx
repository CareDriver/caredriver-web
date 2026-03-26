"use client";

import { useParams } from "next/navigation";
import ReviewFormToChangeFromEnterpriseToUser from "@/components/app_modules/server_users/views/review_forms/to_change_enterprise/ReviewFormToChangeFromEnterpriseToUser";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  const { id } = useParams() as { id: string };
  return (
    <GuardOfRequests>
      <ConsentForm moduleTarget="changeenterprisereq" id={id}>
        <ReviewFormToChangeFromEnterpriseToUser reqId={id} />
      </ConsentForm>
    </GuardOfRequests>
  );
};

export default Page;
