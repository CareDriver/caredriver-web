import FormToChangeProfilePhoto from "@/components/app_modules/users/views/request_forms/to_renew_photo/FormToChangeProfilePhoto";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";

const Page = () => {
    return (
        <GuardForServerUsers>
            <FormToChangeProfilePhoto />
        </GuardForServerUsers>
    );
};

export default Page;
