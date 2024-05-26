import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import PagePermissionValidator from "../PagePermissionValidator";
import { ROLES_TO_REVIEW_REQUESTS } from "@/utils/validator/roles/RoleValidator";
import React from "react";

const PageRequestPermission = ({ children }: { children: React.ReactNode }) => {
    return (
        <PagePermissionValidator roles={ROLES_TO_REVIEW_REQUESTS}>
            <WrapperWithSideBar>{children}</WrapperWithSideBar>
        </PagePermissionValidator>
    );
};

export default PageRequestPermission;
