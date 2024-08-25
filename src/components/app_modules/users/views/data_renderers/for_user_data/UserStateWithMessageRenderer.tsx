import TriangleExclamation from "@/icons/TriangleExclamation";
import { UserInterface } from "@/interfaces/UserInterface";
import UserStateRenderer from "./UserStateRenderer";

const UserStateWithMessageRenderer = ({
    userData,
}: {
    userData: UserInterface | null | undefined;
}) => {
    return (
        <div>
            {userData !== null ? (
                userData !== undefined ? (
                    <UserStateRenderer user={userData} />
                ) : (
                    <span className="icon-wrapper text | yellow-icon bold yellow">
                        <TriangleExclamation />
                        El usuario no fue encontrado, puede que su cuenta haya
                        sido eliminada por completo
                    </span>
                )
            ) : (
                <span className="row-wrapper text | bold gray-medium">
                    <span className="loader-gray-medium | small-loader"></span>{" "}
                    Verificando al usuario
                </span>
            )}
        </div>
    );
};

export default UserStateWithMessageRenderer;
