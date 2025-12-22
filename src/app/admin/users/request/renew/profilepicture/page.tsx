import ListOfRequestsToUpdateUserPhotos from "@/components/app_modules/users/views/list_of_cards/ListOfRequestsToUpdateUserPhotos";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
  return (
    <GuardOfRequests>
      <ListOfRequestsToUpdateUserPhotos />
    </GuardOfRequests>
  );
};

export default Page;
