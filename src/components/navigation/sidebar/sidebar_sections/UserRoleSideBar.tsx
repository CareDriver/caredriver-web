import { UserRole, USER_ROLE_TO_SPANISH } from "@/interfaces/UserInterface";

const UserRoleSideBar = ({
    role,
    customRole,
    children,
}: {
    role?: UserRole;
    customRole?: string;
    children: React.ReactNode;
}) => {
    return (
        <span className="icon-wrapper text green-light | bold medium green green-light-icon lb | margin-top-5 margin-bottom-25 bottom">
            <>{children}</>
            {customRole ? customRole : role && USER_ROLE_TO_SPANISH[role]}
        </span>
    );
};

export default UserRoleSideBar;
