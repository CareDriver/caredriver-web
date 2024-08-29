import PersonCircleCheck from "@/icons/PersonCircleCheck";
import { ChangePhotoReqInterface } from "@/interfaces/ChangePhotoReq";
import { routeToReviewUserRequestToRenewPhotoAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";
import Link from "next/link";

const UserCardWithNewPhoto = ({
    photo,
}: {
    photo: ChangePhotoReqInterface;
}) => {
    return (
        <Link
            href={routeToReviewUserRequestToRenewPhotoAsAdmin(photo.id)}
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

export default UserCardWithNewPhoto;
