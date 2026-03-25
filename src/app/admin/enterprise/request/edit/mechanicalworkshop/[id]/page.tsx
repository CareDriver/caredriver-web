import ClientIdPage from "@/components/guards/ClientIdPage";
import ReviewFormForEditingAnEnterpriseWithLoader from "@/components/app_modules/enterprises/views/review_forms/for_editing/ReviewFormForEditingAnEnterpriseWithLoader";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  return (
    <ClientIdPage>
      {(id) => (
    <GuardOfRequests>
      <ConsentForm moduleTarget="editworkshopreq" id={id}>
        <ReviewFormForEditingAnEnterpriseWithLoader
          reqId={id}
          type="mechanical"
        />
      </ConsentForm>
    </GuardOfRequests>
      )}
    </ClientIdPage>
  );
};


export function generateStaticParams() {
  return [{ id: "_" }];
}

export default Page;
