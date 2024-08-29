import UserProfileForServerUser from "@/components/app_modules/users/views/control_panels/UserProfileForServerUser";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";

const Page = () => {
    return (
        <GuardForServerUsers>
            <UserProfileForServerUser />
        </GuardForServerUsers>
    );
};

export default Page;
