"use client";

import { userReqTypes, UserRequest } from "@/interfaces/UserRequest";
import {
  getAllHistoryData,
  getServiceCollection,
} from "@/components/app_modules/server_users/api/ServicesRequester";
import { CollectionReference } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import CardToRequesterToBeServerUser from "../cards/CardToRequesterToBeServerUser";
import "@/styles/components/service-req.css";
import WholeScreenText from "@/components/modules/WholeScreenText";
import PageLoading from "@/components/loaders/PageLoading";
import { ServiceType } from "@/interfaces/Services";
import Link from "next/link";
import { routeToRequestsToBeUserServerAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUserServerAsAdmin";

const PAGE_SIZE = 8;

const ListOfRequestsHistoryServerUser = ({ type }: { type: ServiceType }) => {
  const [allData, setAllData] = useState<UserRequest[] | null>(null);
  const [page, setPage] = useState(1);

  const collection: CollectionReference = getServiceCollection(type);

  useEffect(() => {
    getAllHistoryData(collection)
      .then(setAllData)
      .catch(console.error);
  }, []);

  const numPages = allData ? Math.max(1, Math.ceil(allData.length / PAGE_SIZE)) : null;

  const pageData = useMemo(() => {
    if (!allData) return [];
    const start = (page - 1) * PAGE_SIZE;
    return allData.slice(start, start + PAGE_SIZE);
  }, [allData, page]);

  const handleNext = () => {
    if (numPages !== null && page >= numPages) return;
    setPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (page <= 1) return;
    setPage((p) => p - 1);
  };

  if (allData === null) return <PageLoading />;

  return (
    <div className="render-data-wrapper">
      <div className="row-wrapper | between items-center margin-bottom-25">
        <h1 className="text | big bold">Historial — {userReqTypes[type]}</h1>
        <Link
          href={routeToRequestsToBeUserServerAsAdmin(type)}
          className="general-button no-full gray"
        >
          ← Solicitudes pendientes
        </Link>
      </div>

      {allData.length === 0 ? (
        <WholeScreenText
          text={`Sin historial de solicitudes para ${userReqTypes[type]}`}
        />
      ) : (
        <>
          <div className="service-req-wrapper">
            {pageData.map((req, i) => (
              <CardToRequesterToBeServerUser
                req={req}
                key={`history-item-${i}`}
                type={type}
              />
            ))}
          </div>

          {numPages !== null && numPages > 1 && (
            <div className="row-wrapper | center gap-16 margin-top-20">
              <button
                className="general-button no-full gray"
                onClick={handlePrev}
                disabled={page <= 1}
              >
                Anterior
              </button>
              <span className="text | small">
                {page} / {numPages}
              </span>
              <button
                className="general-button no-full second-color"
                onClick={handleNext}
                disabled={page >= numPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListOfRequestsHistoryServerUser;
