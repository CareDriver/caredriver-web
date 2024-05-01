"use client";

import PageLoader from "@/components/PageLoader";
import { LicenseUpdateReq } from "@/interfaces/PersonalDocumentsInterface";
import {
    getLicencesToUpdateNumPages,
    getLicencesToUpdatePaginated,
} from "@/utils/requests/LicenseUpdaterReq";
import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import LicenseUpdateItemReq from "./LicenseUpdateItemReq";
import InfiniteScroll from "react-infinite-scroll-component";

const LicenseReqsRenderer = () => {
    const numPerPage = 10;
    const [data, setData] = useState<LicenseUpdateReq[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);

    const handleNextClick = () => {
        if (page === pages) return;
        setPage((prev) => prev + 1);
    };

    useEffect(() => {
        getLicencesToUpdateNumPages(numPerPage)
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
        getLicencesToUpdatePaginated("next", startAfterDoc, endBeforeDoc, numPerPage)
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
            <InfiniteScroll
                dataLength={data.length}
                next={handleNextClick}
                hasMore={page !== pages}
                loader={<span className="loader-gray"></span>}
            >
                {data.map((req, i) => (
                    <LicenseUpdateItemReq
                        license={req}
                        key={`license-update-req-item-${i}`}
                    />
                ))}
            </InfiniteScroll>
        ) : (
            <div className="empty-wrapper | auto-height">
                <h2>No hay peticiones para actualizar licencias</h2>
            </div>
        )
    ) : (
        <PageLoader />
    );
};

export default LicenseReqsRenderer;
