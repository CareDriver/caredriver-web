import ReviewFormToRenewUserPhoto from "@/components/app_modules/users/views/review_forms/to_renew_profile_photos/ReviewFormToRenewUserPhoto";
import ConsentForm from "@/components/guards/views/consent_forms/ConsentForm";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = ({ params }: { params: any }) => {
  return (
    <GuardOfRequests>
      <ConsentForm moduleTarget="editprofilephotoreq" id={params.id}>
        <ReviewFormToRenewUserPhoto reqId={params.id} />
      </ConsentForm>
    </GuardOfRequests>
  );
};

export default Page;
