import { UserRole, UserRoleRender } from "@/interfaces/UserInterface";

const UserRoleSideBar = ({ role, children }: { role: UserRole; children: React.ReactNode }) => {
    return (
        <span className="icon-wrapper text | bolder medium green green-icon lb | margin-top-5 margin-bottom-25 bottom">
            <>{children}</>
            {UserRoleRender[role]}
        </span>
    );
};

export default UserRoleSideBar;
