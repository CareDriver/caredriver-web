import CircleCheck from "@/icons/CircleCheck";
import TriangleExclamation from "@/icons/TriangleExclamation";
import { UserInterface } from "@/interfaces/UserInterface";
import Link from "next/link";

const UserStatusIndicatorV2 = ({ user }: { user: UserInterface }) => {
    const getState = () => {
        if (user.deleted) {
            return (
                <span className="icon-wrapper text | red-icon bold red">
                    <TriangleExclamation />
                    No puedes aprobar esta solicitud porque el usuario fue eliminado
                </span>
            );
        } else if (user.disable) {
            return (
                <Link
                    className="icon-wrapper text | yellow-icon bold yellow"
                    href={`/admin/users/${user.id}`}
                >
                    <TriangleExclamation />
                    El usuario esta desabilitado, deberias considerar rechazar la
                    solicitud o{" "}
                    <b>hacer click aqui para mas informacion sobre el usuario</b>
                </Link>
            );
        }
    };

    return getState();
};

export default UserStatusIndicatorV2;
