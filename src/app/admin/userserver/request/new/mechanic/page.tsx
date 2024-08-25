import ListOfRequestsToBeServerUser from "@/components/app_modules/server_users/views/list_of_cards/ListOfRequestsToBeServerUser";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
    return (
        <GuardOfRequests>
            <ListOfRequestsToBeServerUser type="mechanical" />
        </GuardOfRequests>
    );
};

export default Page;
