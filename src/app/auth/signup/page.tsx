import { AuthenticatorProviderContainer } from "@/components/auth/contexts/AuthenticatorContext";
import AuthenticatorContainer from "@/components/auth/views/containers/AuthenticatorContainer";
import SignUpForm from "@/components/auth/views/sign_up/SignUpForm";

const Page = () => {
    return (
        <AuthenticatorProviderContainer>
            <AuthenticatorContainer authTitle="Registrate !">
                <SignUpForm />
            </AuthenticatorContainer>
        </AuthenticatorProviderContainer>
    );
};

export default Page;
