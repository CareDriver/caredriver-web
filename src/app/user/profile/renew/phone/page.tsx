import { AuthenticatorProviderContainer } from "@/components/auth/contexts/AuthenticatorContext";
import PhoneRegistrationForm from "@/components/auth/views/recorders/PhoneRegistrationForm";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import { CareDriverAuthor, NAME_BUSINESS } from "@/models/Business";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Agregar Número de Teléfono`;
const pageDescription =
    "Agrega tu número de teléfono a tu cuenta para mejorar la seguridad y recibir notificaciones importantes.";

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    applicationName: NAME_BUSINESS,
    authors: CareDriverAuthor,
};

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
