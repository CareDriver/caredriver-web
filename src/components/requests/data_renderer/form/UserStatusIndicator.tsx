import CircleCheck from "@/icons/CircleCheck";
import TriangleExclamation from "@/icons/TriangleExclamation";
import { UserInterface } from "@/interfaces/UserInterface";
import Link from "next/link";

const UserStatusIndicator = ({ user }: { user: UserInterface }) => {
    const getState = () => {
        if (user.deleted) {
            return (
                <span className="icon-wrapper text | red-icon bold red">
                    <TriangleExclamation />
                    El usuario fue eliminado
                </span>
            );
        } else if (user.disable) {
            return (
                <Link
                    className="icon-wrapper text | yellow-icon bold yellow"
                    href={`/admin/users/${user.id}`}
                >
                    <TriangleExclamation />
                    El usuario esta desabilitado, click aqui para mas informacion
                </Link>
            );
        } else {
            return (
                <span className="icon-wrapper text | green-icon bold green">
                    <CircleCheck />
                    Usuario verificado
                </span>
            );
        }
    };

    return getState();
};

export default UserStatusIndicator;
