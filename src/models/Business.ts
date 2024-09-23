import { toCapitalize } from "@/utils/text_helpers/TextFormatter";

export const DRIVER = "conductor";
export const DRIVER_PLURAL = "conductores";

export const PHONE_BUSINESS = "+59177920245";

export const NAME_BUSINESS = "CareDriver";

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
