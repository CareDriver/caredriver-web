import { RefAttachment } from "@/components/form/models/RefAttachment";
import { DEFAULT_PHOTO } from "@/components/app_modules/users/models/MissingUserData";
import { isNullOrEmptyText } from "@/validators/TextValidator";
import { getUrl } from "@/validators/ImageValidator";

interface Props {
    photo: RefAttachment | string | undefined;
}

const UserPhotoRenderer: React.FC<Props> = ({ photo }) => {
    let url = photo ? getUrl(photo) : DEFAULT_PHOTO;
    if (isNullOrEmptyText(url)) {
        url = DEFAULT_PHOTO;
    }

    return <img src={url} className="users-item-photo" alt="" />;
};

export default UserPhotoRenderer;
