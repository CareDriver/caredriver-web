import ListOfRequestsToBeServerUser from "@/components/app_modules/server_users/views/list_of_cards/ListOfRequestsToBeServerUser";
import GuardOfRequests from "@/components/guards/views/page_guards/concrets/GuardOfRequests";
import { CareDriverAuthor, NAME_BUSINESS } from "@/models/Business";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Solicitudes para Mecánico`;

export const metadata: Metadata = {
    title: pageTitle,
    applicationName: NAME_BUSINESS,
    authors: CareDriverAuthor,
};

const Page = () => {
    return (
        <GuardOfRequests>
            <ListOfRequestsToBeServerUser type="mechanical" />
        </GuardOfRequests>
    );
};

export default Page;
