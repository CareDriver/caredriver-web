import CircleCheck from "@/icons/CircleCheck";
import TriangleExclamation from "@/icons/TriangleExclamation";
import { UserInterface } from "@/interfaces/UserInterface";
import {
    differenceOnDays,
    timestampDateInSpanish,
} from "@/utils/helpers/DateHelper";

const UserStateRenderer = ({ user }: { user: UserInterface }) => {
    const IS_DISABLED =
        user.disable ||
        (user.disabledUntil &&
            differenceOnDays(user.disabledUntil.toDate()) > 0);

    const renderState = () => {
        if (user.deleted) {
            return (
                <span className="icon-wrapper text | red-icon bold red margin-bottom-5">
                    <TriangleExclamation />
                    El usuario fue eliminado.
                </span>
            );
        } else if (IS_DISABLED) {
            return (
                <span className="icon-wrapper text | yellow-icon bold yellow margin-bottom-5">
                    <TriangleExclamation />
                    El usuario esta deshabilitado{" "}
                    {user.disabledUntil
                        ? timestampDateInSpanish(user.disabledUntil)
                        : ""}
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
