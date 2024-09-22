import { AuthenticatorProviderContainer } from "@/components/auth/contexts/AuthenticatorContext";
import PhoneRegistrationForm from "@/components/auth/views/recorders/PhoneRegistrationForm";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";

const Page = () => {
    return (
        <GuardForServerUsers>
            <AuthenticatorProviderContainer>
                <PhoneRegistrationForm />
            </AuthenticatorProviderContainer>
        </GuardForServerUsers>
    );
};

export default Page;
