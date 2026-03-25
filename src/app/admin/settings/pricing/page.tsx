import AdminPricingSettingsPanel from "@/components/app_modules/admin_settings/views/AdminPricingSettingsPanel";
import GuardOfPage from "@/components/guards/views/page_guards/base/GuardOfPage";
import { ROLES_TO_MANAGEMENT_ENTERPRISES } from "@/components/guards/models/PermissionsByUserRole";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import { Metadata } from "next";
import {
  CareDriverAuthor,
  DEFAULT_ARTICLE_IMAGE,
  DOMAIN,
  NAME_BUSINESS,
} from "@/models/Business";

const pageTitle = `${NAME_BUSINESS} | Admin Settings de Precios`;
const pageDescription =
  "Gestiona precios recomendados, rangos y comisiones de servicios desde admin-settings.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  applicationName: NAME_BUSINESS,
  authors: CareDriverAuthor,
  openGraph: {
    type: "website",
    url: DOMAIN.concat("/admin/settings/pricing"),
    title: pageTitle,
    description: pageDescription,
    siteName: NAME_BUSINESS,
    images: [
      {
        url: DEFAULT_ARTICLE_IMAGE,
        alt: "Admin settings de precios en CareDriver",
      },
    ],
    locale: "es_ES",
  },
};

const Page = () => {
  return (
    <GuardOfPage roles={ROLES_TO_MANAGEMENT_ENTERPRISES}>
      <WrapperWithSideBar>
        <AdminPricingSettingsPanel />
      </WrapperWithSideBar>
    </GuardOfPage>
  );
};

export default Page;
