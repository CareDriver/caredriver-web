import ReviewFormForEditingAnEnterpriseWithLoader from "@/components/app_modules/enterprises/views/review_forms/for_editing/ReviewFormForEditingAnEnterpriseWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = ({ params }: { params: any }) => {
  return (
    <GuardOfRequests>
      <ConsentForm moduleTarget="editworkshopreq" id={params.id}>
        <ReviewFormForEditingAnEnterpriseWithLoader
          reqId={params.id}
          type="mechanical"
        />
      </ConsentForm>
    </GuardOfRequests>
  );
};

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default Page;
