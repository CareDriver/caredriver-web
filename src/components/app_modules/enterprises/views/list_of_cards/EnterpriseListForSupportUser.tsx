"use client";

import React, { useEffect, useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { Enterprise } from "@/interfaces/Enterprise";
import {
  getNumPagesForSupportUsers,
  getPaginatedDataForSupportUsers,
} from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import SimpleEnterpriseCard from "../cards/SimpleEnterpriseCard";
import "@/styles/components/pagination.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserInterface } from "@/interfaces/UserInterface";
import DataLoading from "@/components/loaders/DataLoading";
import { ServiceType } from "@/interfaces/Services";
import { routeToManageEnterpriseAsUser } from "@/utils/route_builders/as_user/RouteBuilderForEnterpriseAsUser";
import UserGear from "@/icons/UserGear";

interface Props {
  user: UserInterface;
  typeOfEnterprise: ServiceType;
}

const EnterpriseListForSupportUser: React.FC<Props> = ({
  user,
  typeOfEnterprise,
}) => {
  const numPerPage = 20;
  const [data, setData] = useState<Enterprise[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
    undefined,
  );
  const [pages, setPages] = useState<number | null>(null);

  useEffect(() => {
    if (user.id) {
      getNumPagesForSupportUsers(numPerPage, typeOfEnterprise, user.id)
        .then((pages) => setPages(pages))
        .catch((e) => {
          console.log(e);
        });
    }
  }, [typeOfEnterprise, user.id]);

  useEffect(() => {
    if (user.id) {
      const startAfterDoc = lastDoc;
      const endBeforeDoc = undefined;
      getPaginatedDataForSupportUsers(
        typeOfEnterprise,
        user.id,
        "next",
        startAfterDoc,
        endBeforeDoc,
        numPerPage,
      )
        .then((result) => {
          if (data) {
            setData((prev) => prev && [...prev, ...result.result]);
          } else {
            setData(result.result);
          }
          setLastDoc(result.lastDoc);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [page, typeOfEnterprise, user.id]);

  const handleNextClick = () => {
    if (page === pages) return;
    setPage((prev) => prev + 1);
  };

  if (!data) {
    return (
      <div className="auto-height">
        <span className="loader-green | big-loader"></span>
      </div>
    );
  }

  if (data.length <= 0) {
    return (
      <div className="auto-height">
        {/* <h2 className="text">
          <i>
            No se encontró ninguna empresa donde eres <b>usuario soporte </b>.
          </i>
        </h2> */}
      </div>
    );
  }

  return (
    <>
      <h2 className="text | medium-big bold | icon-wrapper lb">
        <UserGear />
        Empresas donde eres usuario soporte
      </h2>
      <InfiniteScroll
        dataLength={data.length}
        next={handleNextClick}
        hasMore={page !== pages}
        loader={<DataLoading />}
      >
        <div className="enterprise-list">
          {data.map(
            (enterprise, i) =>
              enterprise.id && (
                <SimpleEnterpriseCard
                  key={`enterprise-item-${i}`}
                  route={routeToManageEnterpriseAsUser(
                    enterprise.type,
                    enterprise.id,
                  )}
                  enterprise={enterprise}
                />
              ),
          )}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default EnterpriseListForSupportUser;
