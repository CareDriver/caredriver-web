import PersonCircleCheck from "@/icons/PersonCircleCheck";
import UserIcon from "@/icons/UserIcon";
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
            <h3 className="text | bolder capitalize | icon-wrapper">
                <UserIcon />
                {photo.userName}
            </h3>
            <img
                src={photo.newPhoto.url}
                alt=""
                className="personal-data-req-item-photo"
            />
            <div className="separator-horizontal"></div>
            <span
                className="icon-wrapper text |
            green-icon green bold"
            >
                <PersonCircleCheck />
                0/1 Aprobaciones
            </span>
        </Link>
    );
};

export default UserCardWithNewPhoto;
