import UserPlus from "@/icons/UserPlus";
import Users from "@/icons/Users";
import Link from "next/link";

const RegisterSection = ({ pathname }: { pathname: string }) => {
    return (
        <li className="sidebar-options">
            <Link
                href={"/admin/users"}
                className={`sidebar-option ${
                    pathname.includes("users") &&
                    !pathname.includes("register") &&
                    "selected"
                }`}
            >
                <Users />
                <span>Usuarios</span>
            </Link>
            <Link
                href={"/admin/users/register"}
                className={`sidebar-option ${
                    pathname.includes("users/register") && "selected"
                }`}
            >
                <UserPlus />
                <span>Nuevo usuario</span>
            </Link>
        </li>
    );
};

export default RegisterSection;
