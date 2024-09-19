import { UserInterface } from "@/interfaces/UserInterface";
import UserPhotoRenderer from "../data_renderers/for_user_data/UserPhotoRenderer";
import "@/styles/components/users.css";
import TriangleExclamation from "@/icons/TriangleExclamation";
import {
    cutTextWithDotsByLength,
    MAX_LENGTH_FOR_NAMES_DISPLAY,
} from "@/utils/text_helpers/TextCutter";

const SimpleUserCard = ({ user }: { user: UserInterface }) => {
    return (
        <div className="users-item | margin-top-25">
            <UserPhotoRenderer photo={user.photoUrl} />
            <div className="full-width">
                <h2 className="text | bolder medium-big capitalize wrap">
                    {cutTextWithDotsByLength(
                        user.fullName,
                        MAX_LENGTH_FOR_NAMES_DISPLAY,
                    )}
                </h2>
                <h4 className="text | light">{user.email}</h4>
                <h4 className="text | light">{user.location}</h4>
                {user.deleted && (
                    <>
                        <div className="separator-horizontal"></div>
                        <h4 className="text | bold red small | icon-wrapper red-icon llb">
                            <TriangleExclamation />
                            Cuenta eliminada
                        </h4>
                    </>
                )}
            </div>
        </div>
    );
};

export default SimpleUserCard;
