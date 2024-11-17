import FormToChangeUserLocation from "@/components/app_modules/users/views/request_forms/to_renew_location/FormToChangeUserLocation";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import { CareDriverAuthor, NAME_BUSINESS } from "@/models/Business";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Actualizar Localización`;
const pageDescription =
    "Actualiza tu ubicación actual para recibir servicios más precisos y optimizar tus solicitudes.";

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    applicationName: NAME_BUSINESS,
    authors: CareDriverAuthor,
};

const Page = () => {
    return (
        <GuardForServerUsers>
            <FormToChangeUserLocation />
        </GuardForServerUsers>
    );
};

export default Page;
