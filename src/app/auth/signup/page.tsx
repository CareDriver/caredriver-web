import AuthenticatorContainer from "@/components/app_modules/auth/views/containers/AuthenticatorContainer";
import AuthenticatorProviderContainer from "@/components/app_modules/auth/views/containers/AuthenticatorProviderContainer";
import SignUpForm from "@/components/app_modules/auth/views/sign_up/SignUpForm";

const SignUpPage = () => {
    return (
        <AuthenticatorProviderContainer>
            <AuthenticatorContainer authTitle="Registrate !">
                <SignUpForm />
            </AuthenticatorContainer>
        </AuthenticatorProviderContainer>
    );
};

export default SignUpPage;
