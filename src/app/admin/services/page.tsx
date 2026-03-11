import AdminActiveServicesListWithFilters from "@/components/app_modules/services_performed/views/AdminActiveServicesListWithFilters";
import GuardOfPage from "@/components/guards/views/page_guards/base/GuardOfPage";
import { ROLES_TO_VIEW_USER_SERVICES } from "@/components/guards/models/PermissionsByUserRole";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import { Metadata } from "next";
import {
  CareDriverAuthor,
  DEFAULT_ARTICLE_IMAGE,
  DOMAIN,
  NAME_BUSINESS,
} from "@/models/Business";

const pageTitle = `${NAME_BUSINESS} | Servicios Activos`;
const pageDescription =
  "Administra los servicios activos en CareDriver. Filtra por tipo de servicio y ubicación para ver el estado de cada servicio, usuario solicitante, proveedor asignado y detalles importantes.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
  category: "Administración de Servicios",
  keywords: [
    "servicios activos",
    "administración",
    "conductor",
    "mecánico",
    "grúa",
    "lavadero",
  ],
  openGraph: {
    type: "website",
    url: DOMAIN.concat("/admin/services"),
    title: pageTitle,
    description: pageDescription,
    siteName: NAME_BUSINESS,
    images: [
      {
        url: DEFAULT_ARTICLE_IMAGE,
        alt: "Servicios Activos en CareDriver",
      },
    ],
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    site: "@".concat(NAME_BUSINESS),
    creator: "@".concat(NAME_BUSINESS),
    images: DEFAULT_ARTICLE_IMAGE,
    title: pageTitle,
    description: pageDescription,
  },
};

const AdminServicesPage = () => {
  return (
    <GuardOfPage roles={ROLES_TO_VIEW_USER_SERVICES}>
      <WrapperWithSideBar>
        <div className="page-content">
          <h1 className="text | big bold margin-bottom-30">
            Servicios Activos
          </h1>
          <AdminActiveServicesListWithFilters />
        </div>
      </WrapperWithSideBar>
    </GuardOfPage>
  );
};

export default AdminServicesPage;
