"use client";

import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import "@/styles/components/pagination.css";
import { ReqEditEnterprise } from "@/interfaces/Enterprise";
import {
    getEditEnterpriseReqs,
    getEditEnterpriseReqsNumPages,
} from "@/components/app_modules/enterprises/api/EditEnterpriseReq";
import CardToRequestEditEnterprise from "../cards/CardToRequestEditEnterprise";
import InfiniteScroll from "react-infinite-scroll-component";
import "@/styles/components/enterprise-req.css";
import DataLoading from "@/components/loaders/DataLoading";
import { ENTERPRISE_TO_SPANISH_WITH_UNDEFINITE_ARTICLE } from "../../utils/EnterpriseSpanishTranslator";
import WholeScreenText from "@/components/modules/WholeScreenText";
import PageLoading from "@/components/loaders/PageLoading";
import { ServiceType } from "@/interfaces/Services";

const ListOfRequestsToEditEnterprises = ({ type }: { type: ServiceType }) => {
    const numPerPage = 12;
    const [data, setData] = useState<ReqEditEnterprise[] | null>(null);
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
        getEditEnterpriseReqsNumPages(numPerPage, type)
            .then((pages) => {
                setPages(pages);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const startAfterDoc = lastDoc;
        const endBeforeDoc = undefined;
        getEditEnterpriseReqs(
            type,
            "next",
            startAfterDoc,
            endBeforeDoc,
            numPerPage,
        )
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

    if (!data) {
        return <PageLoading />;
    }

    if (data.length <= 0) {
        return (
            <WholeScreenText
                text={`No hay peticiones para editar ${ENTERPRISE_TO_SPANISH_WITH_UNDEFINITE_ARTICLE[type]}`}
            />
        );
    }

    return (
        <div className="render-data-wrapper">
            <h1
                className={
                    "text | big bold margin-bottom-25 capitalize"
                }
            >
                Solicitudes para editar{" "}
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
                        <CardToRequestEditEnterprise
                            enterprise={req}
                            key={`service-req-up-item-${i}`}
                        />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default ListOfRequestsToEditEnterprises;
