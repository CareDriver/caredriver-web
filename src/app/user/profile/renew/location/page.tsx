import FormToChangeUserLocation from "@/components/app_modules/users/views/request_forms/to_renew_location/FormToChangeUserLocation";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";

const Page = () => {
    return (
        <GuardForServerUsers>
            <FormToChangeUserLocation />
        </GuardForServerUsers>
    );
};

export default Page;
