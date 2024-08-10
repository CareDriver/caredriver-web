import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import PagePermissionValidator from "../PagePermissionValidator";
import { ROLES_TO_VIEW_USERS_INFO } from "@/utils/validator/roles/RoleValidator";
import React from "react";

const PageUserInfoPermission = ({ children }: { children: React.ReactNode }) => {
    return (
        <PagePermissionValidator roles={ROLES_TO_VIEW_USERS_INFO}>
            <WrapperWithSideBar>{children}</WrapperWithSideBar>
        </PagePermissionValidator>
    );
};

export default PageUserInfoPermission;
