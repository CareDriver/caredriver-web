import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { checkPermission } from "../../utils/RoleValidator";

const GuardOfModule = ({
    user,
    roles,
    children,
}: {
    user: UserInterface | null;
    roles: UserRole[];
    children: React.ReactNode;
}) => {
    return user && checkPermission(user.role, roles) && <>{children}</>;
};

export default GuardOfModule;
