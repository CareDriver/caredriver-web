import ListOfAllEnterprises from "@/components/app_modules/enterprises/views/list_of_cards/ListOfAllEnterprises";
import GuardOfEnterprises from "@/components/guards/views/page_guards/concrets/GuardOfEnterprises";

const Page = () => {
    return (
        <GuardOfEnterprises>
            <ListOfAllEnterprises type="laundry" />;
        </GuardOfEnterprises>
    );
};

export default Page;
