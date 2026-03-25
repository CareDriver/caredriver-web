import ListOfEnterpriseRegistrationRequests from "@/components/app_modules/enterprises/views/list_of_cards/ListOfEnterpriseRegistrationRequests";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  return (
    <GuardOfRequests>
      <ListOfEnterpriseRegistrationRequests type="mechanical" />
    </GuardOfRequests>
  );
};

export default Page;
