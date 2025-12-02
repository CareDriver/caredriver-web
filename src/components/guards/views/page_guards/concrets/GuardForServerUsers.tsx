import WrapperWithSideBar from "@/layouts/WrapperWithSideBar";
import GuardOfPage from "../base/GuardOfPage";
import { ROLES_FOR_SERVER_USER_ACTIONS } from "@/components/guards/models/PermissionsByUserRole";

const GuardForServerUsers = ({ children }: { children: React.ReactNode }) => {
  return (
    <GuardOfPage roles={ROLES_FOR_SERVER_USER_ACTIONS}>
      <WrapperWithSideBar>{children}</WrapperWithSideBar>
    </GuardOfPage>
  );
};

export default GuardForServerUsers;
