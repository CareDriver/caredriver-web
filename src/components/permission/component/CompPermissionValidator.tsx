import { UserInterface, UserRole } from "@/interfaces/UserInterface";
import { checkPermission } from "@/utils/validator/roles/RoleValidator";

const CompPermissionValidator = ({
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

export default CompPermissionValidator;
