import ListOfRequestsToEditEnterprises from "@/components/app_modules/enterprises/views/list_of_cards/ListOfRequestsToEditEnterprises";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";

const Page = () => {
    return (
        <GuardOfRequests>
            <ListOfRequestsToEditEnterprises type="laundry" />
        </GuardOfRequests>
    );
};

export default Page;
