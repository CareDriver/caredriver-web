import PersonCircleCheck from "@/icons/PersonCircleCheck";
import { BrandingRequest } from "@/interfaces/BrandingInterface";
import Link from "next/link";

const BrandingItemReq = ({ brandingReq }: { brandingReq: BrandingRequest }) => {
    return (
        <Link
            href={`/admin/requests/userinfo/branding/${brandingReq.id}`}
            className="personal-data-req-item | fill-image touchable"
        >
            <h3 className="personal-data-req-item-name">{brandingReq.userName}</h3>
            <img src={brandingReq.brandingImage.url} alt="" />
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

export default BrandingItemReq;
