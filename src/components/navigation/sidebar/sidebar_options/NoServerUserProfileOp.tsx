import UserIcon from "@/icons/UserIcon";
import Link from "next/link";

const NoServerUserProfileOp = ({ pathname }: { pathname: string }) => {
    return (
        <Link
            href={"/admin/profile"}
            className={`sidebar-option ${
                pathname.includes("/admin/profile") && "selected"
            }`}
        >
            <UserIcon />
            <span>Mi Perfil</span>
        </Link>
    );
};

export default NoServerUserProfileOp;
