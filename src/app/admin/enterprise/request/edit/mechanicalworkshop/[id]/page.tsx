"use client";

import { useParams } from "next/navigation";
import ReviewFormForEditingAnEnterpriseWithLoader from "@/components/app_modules/enterprises/views/review_forms/for_editing/ReviewFormForEditingAnEnterpriseWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  const { id } = useParams() as { id: string };
  return (
    <GuardOfRequests>
      <ConsentForm moduleTarget="editworkshopreq" id={id}>
        <ReviewFormForEditingAnEnterpriseWithLoader
          reqId={id}
          type="mechanical"
        />
      </ConsentForm>
    </GuardOfRequests>
  );
};

export default Page;
