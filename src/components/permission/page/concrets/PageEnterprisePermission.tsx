import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import PagePermissionValidator from "../PagePermissionValidator";
import { ROLES_TO_MANAGEMENT_ENTERPRISES } from "@/utils/validator/roles/RoleValidator";
import React from "react";

const PageEnterprisePermission = ({ children }: { children: React.ReactNode }) => {
    return (
        <PagePermissionValidator roles={ROLES_TO_MANAGEMENT_ENTERPRISES}>
            <WrapperWithSideBar>{children}</WrapperWithSideBar>
        </PagePermissionValidator>
    );
};

export default PageEnterprisePermission;
