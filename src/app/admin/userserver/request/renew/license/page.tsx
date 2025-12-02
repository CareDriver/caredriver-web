import ListOfRequestsForLicenseRenewal from "@/components/app_modules/server_users/views/list_of_cards/ListOfRequestsForLicenseRenewal";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  return (
    <GuardOfRequests>
      <ListOfRequestsForLicenseRenewal />
    </GuardOfRequests>
  );
};

export default Page;
