import { UserInterface } from "@/interfaces/UserInterface";
import UserPhotoRenderer from "../data_renderers/for_user_data/UserPhotoRenderer";
import "@/styles/components/users.css"

const SimpleUserCard = ({ user }: { user: UserInterface }) => {
    return (
        <div className="users-item | margin-top-25">
            <UserPhotoRenderer photo={user.photoUrl} />
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
