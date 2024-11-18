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
            <img
                src={photo.newPhoto.url}
                alt=""
                className="personal-data-req-item-photo"
            />
            <div className="personal-data-req-item-body">
                <h2 className="text | bold capitalize wrap">
                    {cutTextWithDotsByLength(
                        photo.userName,
                        MAX_LENGTH_FOR_NAMES_DISPLAY,
                    )}
                </h2>
                <span className="text | circle purple">0/1 Aprobaciones</span>
            </div>
        </Link>
    );
};

export default UserCardWithNewPhoto;
