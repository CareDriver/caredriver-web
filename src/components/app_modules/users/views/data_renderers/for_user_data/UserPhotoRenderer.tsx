import { RefAttachment } from "@/components/form/models/RefAttachment";
import { DEFAULT_PHOTO } from "@/components/app_modules/users/models/MissingUserData";
import { isNullOrEmptyText } from "@/validators/TextValidator";
import { getUrl } from "@/validators/ImageValidator";
import Image from "next/image";

interface Props {
  photo: RefAttachment | string | undefined;
}

const UserPhotoRenderer: React.FC<Props> = ({ photo }) => {
  let url = photo ? getUrl(photo) : DEFAULT_PHOTO;
  if (isNullOrEmptyText(url)) {
    url = DEFAULT_PHOTO;
  }

  return (
    <div
      className="users-item-photo"
      style={{ position: "relative", aspectRatio: "1/1" }}
    >
      <Image
        src={url}
        alt="Foto de usuario"
        fill
        style={{ objectFit: "cover", borderRadius: "50%" }}
        className="rounded-full"
        sizes="(max-width: 600px) 100vw, 200px"
      />
    </div>
  );
};

export default UserPhotoRenderer;
