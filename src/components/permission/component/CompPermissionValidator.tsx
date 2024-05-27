import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { checkPermission } from "@/utils/validator/roles/RoleValidator";

const CompPermissionValidator = ({
    user,
    roles,
    children,
}: {
    user: UserInterface;
    roles: UserRole[];
    children: React.ReactNode;
}) => {
    return checkPermission(user.role, roles) && <>{children}</>;
};

export default CompPermissionValidator;
