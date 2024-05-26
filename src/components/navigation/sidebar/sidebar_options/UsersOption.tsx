import Users from "@/icons/Users";
import Link from "next/link";

const UsersOption = ({ pathname }: { pathname: string }) => {
    return (
        <Link
            href={"/admin/users"}
            className={`sidebar-option ${
                pathname.includes("users") && !pathname.includes("register") && "selected"
            }`}
        >
            <Users />
            <span>Usuarios</span>
        </Link>
    );
};

export default UsersOption;
