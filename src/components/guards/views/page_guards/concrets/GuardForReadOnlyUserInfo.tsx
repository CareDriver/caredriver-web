import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import React from "react";
import GuardOfPage from "../base/GuardOfPage";
import { ROLES_TO_VIEW_USERS_INFO } from "@/components/guards/models/PermissionsByUserRole";

const GuardForReadOnlyUserInfo = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <GuardOfPage roles={ROLES_TO_VIEW_USERS_INFO}>
      <WrapperWithSideBar>{children}</WrapperWithSideBar>
    </GuardOfPage>
  );
};

export default GuardForReadOnlyUserInfo;
