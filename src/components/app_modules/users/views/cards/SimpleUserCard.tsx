import { UserInterface } from "@/interfaces/UserInterface";
import { DEFAULT_PHOTO } from "@/utils/user/UserData";

const SimpleUserCard = ({ user }: { user: UserInterface }) => {
    return (
        <div className="users-item | margin-top-25">
            <img
                src={
                    user.photoUrl.url === "" ? DEFAULT_PHOTO : user.photoUrl.url
                }
                alt=""
                className="users-item-photo"
            />
            <div>
                <h2 className="text | bolder big-medium-v2 capitalize">
                    {user.fullName}
                </h2>
                <h4 className="text | light">{user.email}</h4>
                <h4 className="text | light">{user.location}</h4>
            </div>
        </div>
    );
};

export default SimpleUserCard;
