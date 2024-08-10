import AuthContainer from "@/components/app_modules/auth/views/containers/AuthContainer";
import AuthProviderContainer from "@/components/app_modules/auth/views/containers/AuthProviderContainer";
import SignInForm from "@/components/app_modules/auth/views/sign_in/SignInForm";

const SignInPage = () => {
    return (
        <AuthProviderContainer>
            <AuthContainer authTitle="Inicia sesion">
                <SignInForm />
            </AuthContainer>
        </AuthProviderContainer>
    );
};

export default SignInPage;
