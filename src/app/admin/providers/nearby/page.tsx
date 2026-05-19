import NearbyProvidersPanel from "@/components/app_modules/users/views/NearbyProvidersPanel";
import GuardOfPage from "@/components/guards/views/page_guards/base/GuardOfPage";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import { ROLES_TO_VIEW_USER_SERVICES } from "@/components/guards/models/PermissionsByUserRole";
import { NAME_BUSINESS } from "@/models/Business";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${NAME_BUSINESS} | Proveedores Cercanos`,
};

const NearbyProvidersPage = () => {
  return (
    <GuardOfPage roles={ROLES_TO_VIEW_USER_SERVICES}>
      <WrapperWithSideBar>
        <div className="page-content">
          <h1 className="text | big bold margin-bottom-20">
            Proveedores Cercanos
          </h1>
          <NearbyProvidersPanel />
        </div>
      </WrapperWithSideBar>
    </GuardOfPage>
  );
};

export default NearbyProvidersPage;
