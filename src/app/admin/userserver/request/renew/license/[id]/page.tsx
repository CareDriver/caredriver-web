"use client";

import { useParams } from "next/navigation";
import ReviewFormToRenewLIcense from "@/components/app_modules/server_users/views/review_forms/to_renew_license/ReviewFormToRenewLIcense";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  const { id } = useParams() as { id: string };
  return (
    <GuardOfRequests>
      <ConsentForm moduleTarget="editlicensereq" id={id}>
        <ReviewFormToRenewLIcense reqId={id} />
      </ConsentForm>
    </GuardOfRequests>
  );
};

export default Page;
