import CircleCheck from "@/icons/CircleCheck";
import TriangleExclamation from "@/icons/TriangleExclamation";
import { UserInterface } from "@/interfaces/UserInterface";

const UserStateRenderer = ({ user }: { user: UserInterface }) => {
    const renderState = () => {
        if (user.deleted) {
            return (
                <span className="icon-wrapper text | red-icon bold red margin-bottom-5">
                    <TriangleExclamation />
                    El usuario fue eliminado.
                </span>
            );
        } else if (user.disable) {
            return (
                <span className="icon-wrapper text | yellow-icon bold yellow margin-bottom-5">
                    <TriangleExclamation />
                    El usuario esta deshabilitado.
                </span>
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

    return renderState();
};

export default UserStateRenderer;
