"use client";

import { useEffect, useMemo, useState } from "react";
import { getDocs, query, where } from "firebase/firestore";
import { UserInterface } from "@/interfaces/UserInterface";
import { UserRequest } from "@/interfaces/UserRequest";
import IdCardRenderer from "./IdCardRenderer";
import PoliceRecordsRenderer from "@/components/app_modules/server_users/views/data_renderers/for_police_records/PoliceRecordsRenderer";
import FieldDeleted from "@/components/form/view/field_renderers/FieldDeleted";
import PageLoading from "@/components/loaders/PageLoading";
import UserVehicleRendererAsPopup from "./UserVehicleRendererAsPopup";
import { driveReqCollection } from "@/components/app_modules/server_users/api/DriveRequester";
import { mechanicReqCollection } from "@/components/app_modules/server_users/api/MechanicRequester";
import { towReqCollection } from "@/components/app_modules/server_users/api/TowRequester";
import { laundryReqCollection } from "@/components/app_modules/server_users/api/LaundryRequester";
import { getUserById } from "@/components/app_modules/users/api/UserRequester";
import { timestampDateInSpanish } from "@/utils/helpers/DateHelper";

type RequestType = "driver" | "mechanical" | "tow" | "laundry";

interface RequestHistoryItem {
  type: RequestType;
  request: UserRequest;
}

const REQUEST_LABEL: Record<RequestType, string> = {
  driver: "Conductor",
  mechanical: "Mecánico",
  tow: "Operador de Grúa",
  laundry: "Lavadero",
};

const getLatestReviewTime = (request: UserRequest): number => {
  if (!request.reviewedByHistory || request.reviewedByHistory.length === 0) {
    return 0;
  }

  return request.reviewedByHistory.reduce((max, item) => {
    const current = item.dateTime?.toMillis?.() ?? 0;
    return Math.max(max, current);
  }, 0);
};

const UserDocumentationAndRequestsRenderer = ({
  user,
}: {
  user: UserInterface;
}) => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<RequestHistoryItem[]>([]);
  const [reviewersById, setReviewersById] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user.id) {
        setLoading(false);
        return;
      }

      try {
        const [driverDocs, mechanicDocs, towDocs, laundryDocs] =
          await Promise.all([
            getDocs(query(driveReqCollection, where("userId", "==", user.id))),
            getDocs(
              query(mechanicReqCollection, where("userId", "==", user.id)),
            ),
            getDocs(query(towReqCollection, where("userId", "==", user.id))),
            getDocs(
              query(laundryReqCollection, where("userId", "==", user.id)),
            ),
          ]);

        const mapDocs = (
          type: RequestType,
          docs: typeof driverDocs,
        ): RequestHistoryItem[] =>
          docs.docs.map((doc) => {
            const request = doc.data() as UserRequest;
            return {
              type,
              request: {
                ...request,
                id: doc.id,
              },
            };
          });

        const allRequests = [
          ...mapDocs("driver", driverDocs),
          ...mapDocs("mechanical", mechanicDocs),
          ...mapDocs("tow", towDocs),
          ...mapDocs("laundry", laundryDocs),
        ].sort(
          (a, b) =>
            getLatestReviewTime(b.request) - getLatestReviewTime(a.request),
        );

        setRequests(allRequests);

        const reviewerIds = Array.from(
          new Set(
            allRequests.flatMap((item) =>
              (item.request.reviewedByHistory ?? []).map(
                (review) => review.adminId,
              ),
            ),
          ),
        );

        const reviewerEntries = await Promise.all(
          reviewerIds.map(async (reviewerId) => {
            try {
              const reviewer = await getUserById(reviewerId);
              return [
                reviewerId,
                reviewer?.fullName || reviewer?.fakeId || reviewerId,
              ] as const;
            } catch {
              return [reviewerId, reviewerId] as const;
            }
          }),
        );

        setReviewersById(Object.fromEntries(reviewerEntries));
      } catch (error) {
        console.error("Error al cargar historial de solicitudes del usuario", {
          userId: user.id,
          error,
        });
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user.id]);

  const policeRecordToRender = useMemo(() => {
    if (user.policeRecordsPdf) {
      return user.policeRecordsPdf;
    }

    const requestWithPoliceRecord = requests.find(
      (item) => item.request.policeRecordsPdf,
    );

    return requestWithPoliceRecord?.request.policeRecordsPdf;
  }, [requests, user.policeRecordsPdf]);

  return (
    <div className="form-sub-container | margin-top-25 margin-bottom-25 max-width-60">
      <h2 className="text medium-big bold lb">Documentación y Solicitudes</h2>

      <IdCardRenderer idCard={user.identityCard} />

      {policeRecordToRender ? (
        <PoliceRecordsRenderer pdf={policeRecordToRender} />
      ) : (
        <div className="margin-top-25">
          <FieldDeleted description="El usuario no tiene antecedentes policiales registrados" />
        </div>
      )}

      <div className="form-sub-container | margin-top-25">
        <h3 className="text | medium-big bold lb">Licencias registradas</h3>
        <UserVehicleRendererAsPopup
          vehicle={{
            data: user.serviceVehicles?.car,
            type: "car",
          }}
          content={{
            legend: "Licencia y datos del vehículo (Auto)",
          }}
        />
        <UserVehicleRendererAsPopup
          vehicle={{
            data: user.serviceVehicles?.motorcycle,
            type: "motorcycle",
          }}
          content={{
            legend: "Licencia y datos del vehículo (Motocicleta)",
          }}
        />
        <UserVehicleRendererAsPopup
          vehicle={{
            data: user.serviceVehicles?.tow,
            type: "tow",
          }}
          content={{
            legend: "Licencia y datos del vehículo (Grúa)",
          }}
        />
      </div>

      <div className="form-sub-container | margin-top-25">
        <h3 className="text | medium-big bold lb">Historial de solicitudes</h3>

        {loading ? (
          <PageLoading />
        ) : requests.length === 0 ? (
          <FieldDeleted description="No hay solicitudes registradas para este usuario" />
        ) : (
          requests.map((item) => (
            <div
              key={`${item.type}-${item.request.id}`}
              className="service-user-wrapper | with-data margin-top-15"
            >
              <h4 className="text | medium bold">
                Solicitud: {REQUEST_LABEL[item.type]}
              </h4>
              <p className="text | medium">
                Estado actual:{" "}
                {item.request.active ? "En revisión" : "Finalizada"}
              </p>
              <p className="text | medium">
                Resultado final:{" "}
                {item.request.aproved === undefined
                  ? "Sin resultado final"
                  : item.request.aproved
                    ? "Aprobada"
                    : "Rechazada"}
              </p>
              <p className="text | medium">
                Antecedentes en solicitud:{" "}
                {!!item.request.policeRecordsPdf?.url ? "Sí" : "No"}
              </p>

              {item.request.reviewedByHistory &&
              item.request.reviewedByHistory.length > 0 ? (
                <div className="margin-top-10">
                  <h5 className="text | medium bold">Revisiones</h5>
                  {item.request.reviewedByHistory.map((review, index) => (
                    <p
                      key={`${item.request.id}-review-${index}`}
                      className="text | small"
                    >
                      {review.aproved ? "Aprobó" : "Rechazó"} •{" "}
                      {timestampDateInSpanish(review.dateTime)} • Por:{" "}
                      {reviewersById[review.adminId] || review.adminId}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text | small">Sin revisiones todavía</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDocumentationAndRequestsRenderer;
