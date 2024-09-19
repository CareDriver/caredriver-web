import PersonCircleCheck from "@/icons/PersonCircleCheck";
import UserIcon from "@/icons/UserIcon";
import { ChangePhotoReqInterface } from "@/interfaces/ChangePhotoReq";
import { routeToReviewUserRequestToRenewPhotoAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUsersAsAdmin";
import {
    cutTextWithDotsByLength,
    MAX_LENGTH_FOR_NAMES_DISPLAY,
} from "@/utils/text_helpers/TextCutter";
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
            <h2 className="text | bolder medium-big capitalize wrap | icon-wrapper">
                <UserIcon />
                {cutTextWithDotsByLength(photo.userName, MAX_LENGTH_FOR_NAMES_DISPLAY)}
            </h2>
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
