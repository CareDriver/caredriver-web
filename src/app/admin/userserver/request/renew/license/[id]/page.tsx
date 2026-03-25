import ReviewFormToRenewLIcense from "@/components/app_modules/server_users/views/review_forms/to_renew_license/ReviewFormToRenewLIcense";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = ({ params }: { params: any }) => {
  return (
    <GuardOfRequests>
      <ConsentForm moduleTarget="editlicensereq" id={params.id}>
        <ReviewFormToRenewLIcense reqId={params.id} />
      </ConsentForm>
    </GuardOfRequests>
  );
};

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default Page;
