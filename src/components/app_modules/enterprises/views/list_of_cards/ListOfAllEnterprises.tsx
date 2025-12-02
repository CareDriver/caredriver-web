"use client";

import React, { useEffect, useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { Enterprise } from "@/interfaces/Enterprise";
import {
  getEnterprisesAdminNumPages,
  getEnterprisesAdminPaginated,
} from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import SimpleEnterpriseCard from "../cards/SimpleEnterpriseCard";
import "@/styles/components/pagination.css";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import Plus from "@/icons/Plus";
import "@/styles/components/enterprise.css";
import DataLoading from "@/components/loaders/DataLoading";
import { ENTERPRISE_TO_SPANISH_AS_PLURAL } from "../../utils/EnterpriseSpanishTranslator";
import { ServiceType } from "@/interfaces/Services";
import {
  routeToCreateNewEnterpriseForAdmin,
  routeToManageEnterpriseAsAdmin,
} from "@/utils/route_builders/as_admin/RouteBuilderForEnterpriseAsAdmin";

const ListOfAllEnterprises = ({ type }: { type: ServiceType }) => {
  const numPerPage = 12;
  const [data, setData] = useState<Enterprise[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(
    undefined,
  );
  const [pages, setPages] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    getEnterprisesAdminNumPages(numPerPage, type).then((pages) =>
      setPages(pages),
    );
  }, [type]);

  useEffect(() => {
    const startAfterDoc = lastDoc;
    const endBeforeDoc = undefined;
    getEnterprisesAdminPaginated(
      type,
      "next",
      startAfterDoc,
      endBeforeDoc,
      numPerPage,
      searchTerm,
    ).then((result) => {
      if (data) {
        setData((prev) => prev && [...prev, ...result.result]);
      } else {
        setData(result.result);
      }
      setLastDoc(result.lastDoc);
    });
  }, [page, data, lastDoc, type]);

  const handleNextClick = () => {
    if (page === pages) return;
    setPage((prev) => prev + 1);
  };

  return data ? (
    <section className="enterprise-main-wrapper">
      <h1 className="text | big bold capitalize">
        {ENTERPRISE_TO_SPANISH_AS_PLURAL[type]}
      </h1>
      <Link
        className="small-general-button icon-wrapper | max-20 less-padding no-full center touchable"
        href={routeToCreateNewEnterpriseForAdmin(type)}
      >
        <Plus />
        <span className="text | bold">Nueva empresa</span>
      </Link>
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Buscar por nombre de empresa"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input"
        />
        <button
          className="small-general-button"
          onClick={() => {
            setPage(1);
            setLastDoc(undefined);
            setData(null);
            setSearchTerm(searchInput.trim().toLowerCase());
          }}
        >
          Buscar
        </button>
      </div>

      {data.length > 0 ? (
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
                    route={routeToManageEnterpriseAsAdmin(type, enterprise.id)}
                    enterprise={enterprise}
                  />
                ),
            )}
          </div>
        </InfiniteScroll>
      ) : (
        <div className="empty-wrapper | auto-height">
          <h2 className="text">No se encontraron empresas</h2>
        </div>
      )}
    </section>
  ) : (
    <div className="empty-wrapper | auto-height">
      <span className="loader-green | big-loader"></span>
    </div>
  );
};

export default ListOfAllEnterprises;
