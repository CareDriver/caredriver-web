import { AuthenticatorProviderContainer } from "@/components/auth/contexts/AuthenticatorContext";
import AuthenticatorContainer from "@/components/auth/views/containers/AuthenticatorContainer";
import SignInForm from "@/components/auth/views/sign_in/SignInForm";

const Page = () => {
    return (
        <AuthenticatorProviderContainer>
            <AuthenticatorContainer authTitle="Inicia sesión">
                <SignInForm />
            </AuthenticatorContainer>
        </AuthenticatorProviderContainer>
    );
};

export default Page;
