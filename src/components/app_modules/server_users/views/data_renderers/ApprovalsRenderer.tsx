"use client";
import PersonCircleCheck from "@/icons/PersonCircleCheck";
import { UserRequest } from "@/interfaces/UserRequest";
import {
  MIN_NUM_OF_APPROVALS,
  numOfApprovals,
} from "@/components/app_modules/server_users/api/ServicesRequester";
import { useEffect, useState } from "react";
import { getUserById } from "@/components/app_modules/users/api/UserRequester";
import { timestampDateInSpanishWithHour } from "@/utils/helpers/DateHelper";

const ReviewerName = ({ adminId }: { adminId: string }) => {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    getUserById(adminId)
      .then((u) => setName(u?.fullName ?? adminId))
      .catch(() => setName(adminId));
  }, [adminId]);

  return <span>{name ?? "..."}</span>;
};

const ApprovalsRenderer = ({
  serviceReq,
  reviewed,
}: {
  serviceReq: UserRequest;
  reviewed: boolean;
}) => {
  const history = serviceReq.reviewedByHistory ?? [];

  return (
    <div className="margin-bottom-15">
      <h5
        className={`icon-wrapper row-wrapper baseline text | ${
          serviceReq.active === true
            ? "green-icon green"
            : serviceReq.aproved === true
              ? "green-icon green"
              : "red-icon red"
        } bold mb bottom`}
      >
        <PersonCircleCheck />
        {!serviceReq.active && !serviceReq.aproved
          ? "Rechazado"
          : reviewed
            ? "Revisado"
            : `${numOfApprovals(serviceReq)}/${MIN_NUM_OF_APPROVALS} Aprobaciones`}
      </h5>

      {history.length > 0 && (
        <div className="margin-top-8">
          {history.map((entry, i) => (
            <p
              key={i}
              className={`text | small ${entry.aproved ? "green" : "red"}`}
            >
              {entry.aproved ? "✓ Aprobado" : "✗ Rechazado"} por{" "}
              <ReviewerName adminId={entry.adminId} /> —{" "}
              {timestampDateInSpanishWithHour(entry.dateTime as any)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalsRenderer;
