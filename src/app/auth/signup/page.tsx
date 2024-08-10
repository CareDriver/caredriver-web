import AuthContainer from "@/components/app_modules/auth/views/containers/AuthContainer";
import AuthProviderContainer from "@/components/app_modules/auth/views/containers/AuthProviderContainer";
import SignUpForm from "@/components/app_modules/auth/views/sign_up/SignUpForm";

const SignUpPage = () => {
    return (
        <AuthProviderContainer>
            <AuthContainer authTitle="Registrate !">
                <SignUpForm />
            </AuthContainer>
        </AuthProviderContainer>
    );
};

export default SignUpPage;
