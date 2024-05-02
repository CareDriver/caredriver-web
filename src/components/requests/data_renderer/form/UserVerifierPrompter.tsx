import TriangleExclamation from "@/icons/TriangleExclamation";
import { UserInterface } from "@/interfaces/UserInterface";
import UserStatusIndicator from "./UserStatusIndicator";

const UserVerifierPrompter = ({
    userData,
}: {
    userData: UserInterface | null | undefined;
}) => {
    return (
        <div>
            {userData !== null ? (
                userData !== undefined ? (
                    <UserStatusIndicator user={userData} />
                ) : (
                    <span className="icon-wrapper text | yellow-icon bold yellow">
                        <TriangleExclamation />
                        El usuario no fue encontrado, puede que su cuenta haya sido
                        eliminada por completo
                    </span>
                )
            ) : (
                <span>
                    <span className="loader-gray | small-loader"></span> Verificando al
                    usuario
                </span>
            )}
        </div>
    );
};

export default UserVerifierPrompter;
