"use client";

import { useParams } from "next/navigation";
import ReviewFormToRenewUserPhoto from "@/components/app_modules/users/views/review_forms/to_renew_profile_photos/ReviewFormToRenewUserPhoto";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  const { id } = useParams() as { id: string };
  return (
    <GuardOfRequests>
      <ConsentForm moduleTarget="editprofilephotoreq" id={id}>
        <ReviewFormToRenewUserPhoto reqId={id} />
      </ConsentForm>
    </GuardOfRequests>
  );
};

export default Page;
