import FormToChangeAssociatedEnterprise from "@/components/app_modules/server_users/views/request_forms/requests_to_change_enterprise/FormToChangeAssociatedEnterprise";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";

const Page = () => {
    return (
        <GuardForServerUsers>
            <FormToChangeAssociatedEnterprise typeOfService="driver" />
        </GuardForServerUsers>
    );
};

export default Page;
