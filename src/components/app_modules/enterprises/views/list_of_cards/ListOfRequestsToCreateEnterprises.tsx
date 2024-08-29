"use client";

import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import "@/styles/components/pagination.css";
import CardToRequestCreateEnterprise from "../cards/CardToRequestCreateEnterprise";
import {
    getEnterpriseReqs,
    getEnterpriseReqsNumPages,
} from "@/components/app_modules/enterprises/api/EnterpriseRequester";
import { Enterprise } from "@/interfaces/Enterprise";
import InfiniteScroll from "react-infinite-scroll-component";
import "@/styles/components/enterprise-req.css";
import DataLoading from "@/components/loaders/DataLoading";
import PageLoading from "@/components/loaders/PageLoading";
import WholeScreenText from "@/components/modules/WholeScreenText";
import { ENTERPRISE_TO_SPANISH_WITH_UNDEFINITE_ARTICLE } from "../../utils/EnterpriseSpanishTranslator";
import { ServiceType } from "@/interfaces/Services";

const ListOfRequestsToCreateEnterprises = ({
    type,
}: {
    type: ServiceType;
}) => {
    const PAGE_SIZE = 10;
    const [data, setData] = useState<Enterprise[] | null>(null);
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
        getEnterpriseReqsNumPages(PAGE_SIZE, type)
            .then((pages) => {
                setPages(pages);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const startAfterDoc = lastDoc;
        const endBeforeDoc = undefined;
        getEnterpriseReqs(type, "next", startAfterDoc, endBeforeDoc, PAGE_SIZE)
            .then((result) => {
                if (data) {
                    setData([...data, ...result.result]);
                } else {
                    setData(result.result);
                }
                setLastDoc(result.lastDoc);
            })
            .catch(() => {});
    }, [page]);

    return data ? (
        data.length > 0 ? (
            <div className="render-data-wrapper">
                <h1
                    className={
                        "text | big-medium bolder margin-bottom-25 capitalize"
                    }
                >
                    Solicitudes para crear{" "}
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
                            <CardToRequestCreateEnterprise
                                enterprise={req}
                                type={type}
                                key={`service-req-item-${i}`}
                            />
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        ) : (
            <WholeScreenText
                text={`No hay peticiones para crear ${ENTERPRISE_TO_SPANISH_WITH_UNDEFINITE_ARTICLE[type]}`}
            />
        )
    ) : (
        <PageLoading />
    );
};

export default ListOfRequestsToCreateEnterprises;
