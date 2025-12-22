import PersonCircleCheck from "@/icons/PersonCircleCheck";
import { BrandingRequest } from "@/interfaces/BrandingInterface";
import { routeToNoFound } from "@/utils/route_builders/as_not_logged/RouteBuilderForRedirectors";
import {
  cutTextWithDotsByLength,
  MAX_LENGTH_FOR_NAMES_DISPLAY,
} from "@/utils/text_helpers/TextCutter";
import Image from "next/image";
import Link from "next/link";

const UserCardWithBranding = ({
  brandingReq,
}: {
  brandingReq: BrandingRequest;
}) => {
  return (
    <Link
      href={routeToNoFound()}
      className="personal-data-req-item | fill-image touchable"
    >
      <h2 className="text | bold medium-big capitalize wrap">
        {cutTextWithDotsByLength(
          brandingReq.userName,
          MAX_LENGTH_FOR_NAMES_DISPLAY,
        )}
      </h2>
      <Image fill src={brandingReq.brandingImage.url} alt="" />
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

export default UserCardWithBranding;
