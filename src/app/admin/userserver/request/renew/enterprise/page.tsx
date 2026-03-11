import ListOfRequestsForChangeEnteprise from "@/components/app_modules/server_users/views/list_of_cards/ListOfRequestsForChangeEnteprise";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  return (
    <GuardOfRequests>
      <ListOfRequestsForChangeEnteprise />
    </GuardOfRequests>
  );
};

export default Page;
