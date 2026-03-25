"use client";

import { EnterpriseRequest } from "@/interfaces/Enterprise";
import { routeToReviewEnterpriseRegistrationRequestAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";
import Link from "next/link";
import "@/styles/components/enterprise.css";
import {
  cutTextWithDotsByLength,
  MAX_LENGTH_FOR_NAMES_DISPLAY,
} from "@/utils/text_helpers/TextCutter";

const CardToEnterpriseRegistrationRequest = ({
  request,
}: {
  request: EnterpriseRequest;
}) => {
  return (
    request.id && (
      <Link
        href={routeToReviewEnterpriseRegistrationRequestAsAdmin(
          request.type,
          request.id,
        )}
        className="enterprise-item | touchable"
      >
        <div className="enterprise-item-header">
          <img
            className="enterprise-item-logo-bg"
            src={request.logoImgUrl.url}
            alt=""
          />
          <img
            className="enterprise-item-logo"
            src={request.logoImgUrl.url}
            alt=""
          />
        </div>
        <div className="enterprise-item-body">
          <h3 className="text | bold capitalize wrap">
            {cutTextWithDotsByLength(
              request.name,
              MAX_LENGTH_FOR_NAMES_DISPLAY,
            )}
          </h3>
          <p className="text | light">
            {request.members.length} miembro
            {request.members.length !== 1 ? "s" : ""}
          </p>
          {request.location && <h4 className="text">{request.location}</h4>}
        </div>
      </Link>
    )
  );
};

export default CardToEnterpriseRegistrationRequest;
