import { ChangePhotoReqInterface } from "@/interfaces/ChangePhotoReq";
import Link from "next/link";

const UpPhotoItemReq = ({ photo }: { photo: ChangePhotoReqInterface }) => {
    return (
        <Link href={`/admin/requests/userinfo/photo/${photo.id}`}>
            <h3>{photo.userName}</h3>
        </Link>
    );
};

export default UpPhotoItemReq;
