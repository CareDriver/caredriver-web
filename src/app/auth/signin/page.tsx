import AuthenticatorContainer from "@/components/app_modules/auth/views/containers/AuthenticatorContainer";
import AuthenticatorProviderContainer from "@/components/app_modules/auth/views/containers/AuthenticatorProviderContainer";
import SignInForm from "@/components/app_modules/auth/views/sign_in/SignInForm";

const SignInPage = () => {
    return (
        <AuthenticatorProviderContainer>
            <AuthenticatorContainer authTitle="Inicia sesion">
                <SignInForm />
            </AuthenticatorContainer>
        </AuthenticatorProviderContainer>
    );
};

export default SignInPage;
