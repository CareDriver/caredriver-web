import FormToChangeProfilePhoto from "@/components/app_modules/users/views/request_forms/to_renew_photo/FormToChangeProfilePhoto";
import GuardForServerUsers from "@/components/guards/views/page_guards/concrets/GuardForServerUsers";
import { CareDriverAuthor, NAME_BUSINESS } from "@/models/Business";
import { Metadata } from "next";

const pageTitle = `${NAME_BUSINESS} | Actualizar Foto de Perfil`;
const pageDescription =
    "Envía una solicitud para actualizar tu foto de perfil y mantener tu imagen actualizada en nuestra plataforma.";

export const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    applicationName: NAME_BUSINESS,
    authors: CareDriverAuthor,
};

const Page = () => {
    return (
        <GuardForServerUsers>
            <FormToChangeProfilePhoto />
        </GuardForServerUsers>
    );
};

export default Page;
