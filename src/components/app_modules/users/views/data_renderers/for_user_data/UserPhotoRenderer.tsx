import { RefAttachment } from "@/components/form/models/RefAttachment";
import { DEFAULT_PHOTO } from "@/components/app_modules/users/models/MissingUserData";
import { isNullOrEmptyText } from "@/validators/TextValidator";

interface Props {
    photo: RefAttachment | undefined;
}

const UserPhotoRenderer: React.FC<Props> = ({ photo }) => {
    const PHOTO =
        !photo || isNullOrEmptyText(photo.url) ? DEFAULT_PHOTO : photo.url;

    return <img src={PHOTO} className="users-item-photo" alt="" />;
};

export default UserPhotoRenderer;
