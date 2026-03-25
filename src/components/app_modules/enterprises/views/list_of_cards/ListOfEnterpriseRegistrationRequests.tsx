"use client";

import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import "@/styles/components/pagination.css";
import "@/styles/components/enterprise-req.css";
import { EnterpriseRequest } from "@/interfaces/Enterprise";
import {
  getEnterpriseRequestsPaginated,
  getEnterpriseRequestsNumPages,
} from "@/components/app_modules/enterprises/api/EnterpriseRequestRequester";
import CardToEnterpriseRegistrationRequest from "../cards/CardToEnterpriseRegistrationRequest";
import InfiniteScroll from "react-infinite-scroll-component";
import DataLoading from "@/components/loaders/DataLoading";
import { ENTERPRISE_TO_SPANISH_WITH_UNDEFINITE_ARTICLE } from "../../utils/EnterpriseSpanishTranslator";
import WholeScreenText from "@/components/modules/WholeScreenText";
import PageLoading from "@/components/loaders/PageLoading";
import { ServiceType } from "@/interfaces/Services";

const ListOfEnterpriseRegistrationRequests = ({
  type,
}: {
  type: ServiceType;
}) => {
  const numPerPage = 12;
  const [data, setData] = useState<EnterpriseRequest[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
    undefined,
  );
  const [pages, setPages] = useState<number | null>(null);

  const handleNextClick = () => {
    if (page === pages) return;
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    getEnterpriseRequestsNumPages(numPerPage, type)
      .then((pages) => {
        setPages(pages);
      })
      .catch(() => {});
  }, [type]);

  useEffect(() => {
    getEnterpriseRequestsPaginated(type, "next", lastDoc, undefined, numPerPage)
      .then((result) => {
        if (data) {
          setData((prev) => prev && [...prev, ...result.result]);
        } else {
          setData(result.result);
        }
        setLastDoc(result.lastDoc);
      })
      .catch(() => {});
  }, [page, type]);

  if (!data) {
    return <PageLoading />;
  }

  if (data.length <= 0) {
    return (
      <WholeScreenText
        text={`No hay solicitudes de registro para ${ENTERPRISE_TO_SPANISH_WITH_UNDEFINITE_ARTICLE[type]}`}
      />
    );
  }

  return (
    <div className="render-data-wrapper">
      <h1 className={"text | big bold margin-bottom-25 capitalize"}>
        Solicitudes de registro de{" "}
        {ENTERPRISE_TO_SPANISH_WITH_UNDEFINITE_ARTICLE[type]}
      </h1>
      <InfiniteScroll
        dataLength={data.length}
        next={handleNextClick}
        hasMore={page !== pages}
        loader={<DataLoading />}
      >
        <div className="enterprise-req-wrapper">
          {data.map((req, i) => (
            <CardToEnterpriseRegistrationRequest
              request={req}
              key={`ent-reg-req-${i}`}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ListOfEnterpriseRegistrationRequests;
