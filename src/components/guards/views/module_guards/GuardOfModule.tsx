import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { checkPermission } from "../../validators/RoleValidator";

interface Props {
  user?: UserInterface;
  roles: UserRole[];
  children: React.ReactNode;
}

const GuardOfModule: React.FC<Props> = ({ user, roles, children }) => {
  return user && checkPermission(user.role, roles) && <>{children}</>;
};

export default GuardOfModule;
