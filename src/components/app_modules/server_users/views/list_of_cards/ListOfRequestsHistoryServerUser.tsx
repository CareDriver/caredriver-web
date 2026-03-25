"use client";

import { userReqTypes, UserRequest } from "@/interfaces/UserRequest";
import {
  getHistoryPaginatedData,
  getHistoryNumPages,
  getServiceCollection,
} from "@/components/app_modules/server_users/api/ServicesRequester";
import { CollectionReference, DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import CardToRequesterToBeServerUser from "../cards/CardToRequesterToBeServerUser";
import "@/styles/components/service-req.css";
import DataLoading from "@/components/loaders/DataLoading";
import WholeScreenText from "@/components/modules/WholeScreenText";
import PageLoading from "@/components/loaders/PageLoading";
import { ServiceType } from "@/interfaces/Services";
import Link from "next/link";
import { routeToRequestsToBeUserServerAsAdmin } from "@/utils/route_builders/as_admin/RouteBuilderForUserServerAsAdmin";

const PAGE_SIZE = 8;

const ListOfRequestsHistoryServerUser = ({ type }: { type: ServiceType }) => {
  const [data, setData] = useState<UserRequest[] | null>(null);
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageStartDocs, setPageStartDocs] = useState<
    Record<number, DocumentSnapshot | undefined>
  >({ 1: undefined });

  const collection: CollectionReference = getServiceCollection(type);

  const loadPage = async (
    pageNum: number,
    startAfterDoc?: DocumentSnapshot,
  ) => {
    setIsLoading(true);
    try {
      const result = await getHistoryPaginatedData(
        collection,
        startAfterDoc,
        PAGE_SIZE,
      );
      setData(result.result);
      if (result.lastDoc) {
        setPageStartDocs((prev) => ({
          ...prev,
          [pageNum + 1]: result.lastDoc,
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getHistoryNumPages(PAGE_SIZE, collection)
      .then(setNumPages)
      .catch(console.error);
    loadPage(1, undefined);
  }, []);

  const handleNext = () => {
    if (numPages !== null && page >= numPages) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(nextPage, pageStartDocs[nextPage]);
  };

  const handlePrev = () => {
    if (page <= 1) return;
    const prevPage = page - 1;
    setPage(prevPage);
    loadPage(prevPage, pageStartDocs[prevPage]);
  };

  if (isLoading && data === null) return <PageLoading />;

  return (
    <div className="render-data-wrapper">
      <div className="row-wrapper | between items-center margin-bottom-25">
        <h1 className="text | big bold">Historial — {userReqTypes[type]}</h1>
        <Link
          href={routeToRequestsToBeUserServerAsAdmin(type)}
          className="general-button gray"
        >
          ← Solicitudes pendientes
        </Link>
      </div>

      {data && data.length === 0 && !isLoading ? (
        <WholeScreenText
          text={`Sin historial de solicitudes para ${userReqTypes[type]}`}
        />
      ) : (
        <>
          {isLoading ? (
            <DataLoading />
          ) : (
            <div className="service-req-wrapper">
              {data?.map((req, i) => (
                <CardToRequesterToBeServerUser
                  req={req}
                  key={`history-item-${i}`}
                  type={type}
                />
              ))}
            </div>
          )}

          <div className="row-wrapper | center gap-16 margin-top-20">
            <button
              className="general-button gray"
              onClick={handlePrev}
              disabled={page <= 1 || isLoading}
            >
              Anterior
            </button>
            <span className="text | small">
              {numPages !== null ? `${page} / ${numPages}` : `Página ${page}`}
            </span>
            <button
              className="general-button green"
              onClick={handleNext}
              disabled={(numPages !== null && page >= numPages) || isLoading}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListOfRequestsHistoryServerUser;
