import ClientIdPage from "@/components/guards/ClientIdPage";
import ReviewFormToRenewLIcense from "@/components/app_modules/server_users/views/review_forms/to_renew_license/ReviewFormToRenewLIcense";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  return (
    <ClientIdPage>
      {(id) => (
    <GuardOfRequests>
      <ConsentForm moduleTarget="editlicensereq" id={id}>
        <ReviewFormToRenewLIcense reqId={id} />
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
