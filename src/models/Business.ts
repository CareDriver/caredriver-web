import { ServiceType } from "@/interfaces/Services";
import { toCapitalize } from "@/utils/text_helpers/TextFormatter";
import { Author } from "next/dist/lib/metadata/types/metadata-types";

export const DRIVER = "conductor";

export const DRIVER_PLURAL = "conductores";

export const PHONE_BUSINESS = "+59177920245";

export const NAME_BUSINESS = "CareDriver";

export const DOMAIN = "https://caredriver-test-turg.vercel.app/";

export const DOMAIN_LANDING_PAGE = "https://caredriver.netlify.app/";

export const DEFAULT_ARTICLE_IMAGE = DOMAIN.concat(
    "images/articles/deafultarticle.png",
);

export const POLICY_AND_PRIVACY =
    DOMAIN_LANDING_PAGE.concat("policyandprivacy/");

export const SECURITY_TERMS = DOMAIN_LANDING_PAGE.concat("securityterms/");

export const CareDriverAuthor: Author = {
    name: NAME_BUSINESS,
    url: "https://caredriver.netlify.app/aboutus/",
};

export const DESCRIPTION_BUSINESS = {
    short: `Servicios de ${toCapitalize(
        DRIVER,
    )}, Mecánico, Operador de Grúa y Lavadero - Inscripción y Administración Eficiente`,
    large: [
        "Nuestra plataforma de administración simplifica el proceso de registro y gestión, conectando a proveedores de servicios con clientes que buscan soluciones confiables.",
        "Optimiza tu perfil y aumenta tu visibilidad en la búsqueda de oportunidades laborales en la industria del transporte y mantenimiento.",
    ],
};

export const MOBILE_APP_LINKS = {
    android: {
        deepLink: "myapp://ruta-en-tu-app",
        store: "https://play.google.com/store/apps/details?id=com.tuapp",
    },
    mac: {
        deepLink: "myapp://ruta-en-tu-app",
        store: "https://apps.apple.com/us/app/tu-app/id123456789",
    },
};

export function routeToLandingPageServiceDetails(
    serviceType: ServiceType,
): string {
    const type = () => {
        switch (serviceType) {
            case "driver":
                return "driver";
            case "mechanical":
                return "mechanical";
            case "laundry":
                return "laundry";
            case "tow":
                return "craneoperator";
            default:
                return "driver";
        }
    };

    return DOMAIN_LANDING_PAGE.concat("services/")
        .concat(type())
        .concat("#information");
}
