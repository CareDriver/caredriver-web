import TriangleExclamation from "@/icons/TriangleExclamation";
import { UserInterface } from "@/interfaces/UserInterface";
import Link from "next/link";

const UserStatusIndicatorV2 = ({ user }: { user: UserInterface }) => {
    const getState = () => {
        if (user.deleted) {
            return (
                <span className="icon-wrapper text | red-icon bold red margin-bottom-5">
                    <TriangleExclamation />
                    No puedes aprobar esta solicitud porque el usuario fue eliminado
                </span>
            );
        } else if (user.disable) {
            return (
                <Link
                    className="icon-wrapper text | yellow-icon bold yellow margin-bottom-5"
                    href={`/admin/users/${user.id}`}
                >
                    <TriangleExclamation />
                    El usuario esta deshabilitado, deberías considerar rechazar la
                    solicitud o hacer click aquí para mas información sobre el usuario
                </Link>
            );
        }
    };

    return getState();
};

export default UserStatusIndicatorV2;
