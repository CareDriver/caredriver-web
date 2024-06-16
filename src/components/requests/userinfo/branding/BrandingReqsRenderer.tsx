"use client";

import PageLoader from "@/components/PageLoader";
import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "@/styles/components/personal-data-req.css";
import MiddleMessage from "@/components/MiddleMessage";
import DataLoaderIndicator from "@/components/DataLoaderIndicator";
import BrandingItemReq from "./BrandingItemReq";
import { BrandingRequest } from "@/interfaces/BrandingInterface";
import {
    getBrandingReqNumPages,
    getBrandingReqPaginated,
} from "@/utils/requests/BrandingReqs";

const BrandingReqsRenderer = () => {
    const numPerPage = 10;
    const [data, setData] = useState<BrandingRequest[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);

    useEffect(() => {
        getBrandingReqNumPages(numPerPage)
            .then((pages) => {
                setPages(pages);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    useEffect(() => {
        const startAfterDoc = lastDoc;
        const endBeforeDoc = undefined;
        getBrandingReqPaginated("next", startAfterDoc, endBeforeDoc, numPerPage)
            .then((result) => {
                if (data) {
                    setData([...data, ...result.result]);
                } else {
                    setData(result.result);
                }
                setLastDoc(result.lastDoc);
            })
            .catch((e) => {console.log(e);
            });
    }, [page]);

    const handleNextClick = () => {
        if (page === pages) return;
        setPage((prev) => prev + 1);
    };

    return data ? (
        data.length > 0 ? (
            <div className="render-data-wrapper">
                <h1 className={"text | big-medium bolder margin-bottom-25 capitalize"}>
                    Solicitudes de verificacion de Branding
                </h1>
                <InfiniteScroll
                    dataLength={data.length}
                    next={handleNextClick}
                    hasMore={page !== pages}
                    loader={<DataLoaderIndicator />}
                >
                    <div className="personal-data-req-wrapper">
                        {data.map((req, i) => (
                            <BrandingItemReq
                                brandingReq={req}
                                key={`branding-req-item-${i}`}
                            />
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        ) : (
            <MiddleMessage message="No hay peticiones para verificar branding por usuarios" />
        )
    ) : (
        <PageLoader />
    );
};

export default BrandingReqsRenderer;
