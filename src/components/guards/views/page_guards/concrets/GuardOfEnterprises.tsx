import React from "react";
import GuardOfPage from "../base/GuardOfPage";
import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import { ROLES_TO_MANAGEMENT_ENTERPRISES } from "@/components/guards/models/PermissionsByUserRole";

const GuardOfEnterprises = ({ children }: { children: React.ReactNode }) => {
    return (
        <GuardOfPage roles={ROLES_TO_MANAGEMENT_ENTERPRISES}>
            <WrapperWithSideBar>{children}</WrapperWithSideBar>
        </GuardOfPage>
    );
};

export default GuardOfEnterprises;
