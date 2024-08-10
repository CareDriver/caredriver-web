import PersonCircleCheck from "@/icons/PersonCircleCheck";
import { ChangePhotoReqInterface } from "@/interfaces/ChangePhotoReq";
import Link from "next/link";

const UpPhotoItemReq = ({ photo }: { photo: ChangePhotoReqInterface }) => {
    return (
        <Link
            href={`/admin/requests/userinfo/photo/${photo.id}`}
            className="personal-data-req-item"
        >
            <h3 className="personal-data-req-item-name">{photo.userName}</h3>
            <img
                src={photo.newPhoto.url}
                alt=""
                className="personal-data-req-item-photo"
            />
            <span
                className="icon-wrapper personal-data-req-item-aprove text |
            green-icon green bold"
            >
                <PersonCircleCheck />
                0/1
            </span>
        </Link>
    );
};

export default UpPhotoItemReq;
