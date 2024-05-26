import UserPlus from "@/icons/UserPlus";
import Link from "next/link";

const AddNewUserOption = ({ pathname }: { pathname: string }) => {
    return (
        <Link
            href={"/admin/users/register"}
            className={`sidebar-option ${
                pathname.includes("users/register") && "selected"
            }`}
        >
            <UserPlus />
            <span>Nuevo usuario</span>
        </Link>
    );
};

export default AddNewUserOption;
