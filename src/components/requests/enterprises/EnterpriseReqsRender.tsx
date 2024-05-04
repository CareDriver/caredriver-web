"use client";

import PageLoader from "@/components/PageLoader";
import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import "@/styles/components/pagination.css";
import EnterpriseItemReq from "./EnterpriseItemReq";
import {
    getEnterpriseReqs,
    getEnterpriseReqsNumPages,
} from "@/utils/requests/enterprise/EnterpriseRequester";
import { Enterprise, EnterpriseTypeRender } from "@/interfaces/Enterprise";
import InfiniteScroll from "react-infinite-scroll-component";
import "@/styles/components/enterprise-req.css";

const EnterpriseReqsRender = ({ type }: { type: "mechanical" | "tow" }) => {
    const numPerPage = 10;
    const [data, setData] = useState<Enterprise[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>(undefined);
    const [pages, setPages] = useState<number | null>(null);

    const handleNextClick = () => {
        if (page === pages) return;
        setPage((prev) => prev + 1);
    };

    useEffect(() => {
        getEnterpriseReqsNumPages(numPerPage, type)
            .then((pages) => {
                setPages(pages);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const startAfterDoc = lastDoc;
        const endBeforeDoc = undefined;
        getEnterpriseReqs(type, "next", startAfterDoc, endBeforeDoc, numPerPage)
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
                <h1 className={"text | big-medium bolder margin-bottom-25 capitalize"}>
                    Solicitudes para crear {type === "tow" ? "una" : "un"}{" "}
                    {EnterpriseTypeRender[type]}
                </h1>

                <InfiniteScroll
                    dataLength={data.length}
                    next={handleNextClick}
                    hasMore={page !== pages}
                    loader={<span className="loader-gray"></span>}
                >
                    <div className="enterprise-req-wrapper">
                        {data.map((req, i) => (
                            <EnterpriseItemReq
                                enterprise={req}
                                type={type}
                                key={`service-req-item-${i}`}
                            />
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        ) : (
            <div className="empty-wrapper | auto-height">
                <h2>
                    No hay peticiones para crear {type === "tow" ? "una" : "un"}{" "}
                    {EnterpriseTypeRender[type]}
                </h2>
            </div>
        )
    ) : (
        <PageLoader />
    );
};

export default EnterpriseReqsRender;
